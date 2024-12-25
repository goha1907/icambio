from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from django.conf import settings
from .models import Order, OrderItem, Review
from .serializers import OrderSerializer, ReviewSerializer
from .permissions import IsOrderOwner, CanManageOrders


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.groups.filter(name__in=['Operator', 'Branch Owner', 'Admin']).exists():
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update']:
            return [IsOrderOwner() | CanManageOrders()]
        return super().get_permissions()

    def perform_create(self, serializer):
        try:
            order = serializer.save(
                user=self.request.user if self.request.user.is_authenticated else None
            )
            # Отправляем email о создании заказа
            self._send_order_email(order, 'created')
        except ValidationError as e:
            raise DRFValidationError(detail=str(e))

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')

        if not request.user.has_perm('orders.change_order') and not request.user.is_staff:
            return Response(
                {'error': 'У вас нет прав на изменение статуса заказа'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Проверяем возможность изменения статуса
        if order.status == 'COMPLETED' and new_status != 'CANCELLED':
            return Response(
                {'status': 'Cannot change status of completed order'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()

        # Отправляем email об изменении статуса
        self._send_order_email(order, 'status_changed')

        return Response({'status': 'Status updated'})

    def _send_order_email(self, order, email_type):
        """Отправка email уведомлений"""
        subject = f'Заказ #{order.id} - '
        if email_type == 'created':
            subject += 'создан'
            message = f'Ваш заказ #{order.id} успешно создан и принят в обработку.'
        else:
            subject += 'обновлен статус'
            message = f'Статус вашего заказа #{order.id} изменен на {order.get_status_display()}.'

        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [order.client_email],
            fail_silently=False,
        )


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save()
