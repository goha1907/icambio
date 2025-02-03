from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.permissions import IsOperator, IsAdministrator, IsOwner
from orders.models import Order, Review
from orders.serializers import (
    OrderSerializer,
    OrderTrackingSerializer,
    OrderStatusUpdateSerializer,
    OrderDocumentSerializer,
    ReviewCreateSerializer,
    ReviewDetailSerializer,
    ReviewPublicSerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [IsAuthenticated & (IsOperator | IsAdministrator | IsOwner)]
        elif self.action == 'destroy':
            permission_classes = [IsAdministrator | IsOwner]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(
            name__in=['Operators', 'Administrators', 'Owners']
        ).exists():
            return Order.objects.all().prefetch_related('items')
        return Order.objects.filter(user=user).prefetch_related('items')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """Загрузка документа к заказу"""
        order = self.get_object()
        serializer = OrderDocumentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                order=order,
                uploaded_by=request.user
            )
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['get'])
    def documents(self, request, pk=None):
        """Получение списка документов заказа"""
        order = self.get_object()
        documents = order.documents.all()
        serializer = OrderDocumentSerializer(documents, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Обновление статуса заказа"""
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(
            order,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(OrderSerializer(order).data)

    def update(self, request, *args, **kwargs):
        """Запрещаем обновление статуса через общий update"""
        if 'status' in request.data:
            return Response(
                {"detail": "Для изменения статуса используйте endpoint /update_status/"},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().update(request, *args, **kwargs)


class OrderTrackingView(generics.RetrieveAPIView):
    """
    Публичный эндпоинт для отслеживания заказа по коду
    Доступен без аутентификации
    """
    serializer_class = OrderTrackingSerializer
    queryset = Order.objects.all()
    lookup_field = 'tracking_code'
    permission_classes = []  # Доступно без авторизации


class ReviewViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        user = self.request.user
        if self.action == 'list_public':
            # Для публичного списка только видимые отзывы
            return Review.objects.filter(is_visible=True)
        if user.groups.filter(name__in=['Administrators', 'Owners']).exists():
            # Для персонала все отзывы
            return Review.objects.all()
        # Для обычных пользователей только свои отзывы
        return Review.objects.filter(order__user=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        if self.action == 'list_public':
            return ReviewPublicSerializer
        return ReviewDetailSerializer

    def get_permissions(self):
        if self.action == 'list_public':
            return [permissions.AllowAny()]
        if self.action in ['update', 'partial_update']:
            return [IsAdministrator | IsOwner()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def list_public(self, request):
        """Публичный список отзывов для отображения на сайте"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save()
