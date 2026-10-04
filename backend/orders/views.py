from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import (
    DjangoFilterBackend, FilterSet, DateFromToRangeFilter
)
from rest_framework.filters import SearchFilter, OrderingFilter
from users.permissions import IsOwnerOrOperator
from orders.models import Order, OrderProfit
from orders.serializers import (
    OrderSerializer, OrderListSerializer, OrderCreateSerializer,
    OrderUpdateSerializer, OrderProfitSerializer
)
from rest_framework.pagination import PageNumberPagination


class OrderPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class OrderFilter(FilterSet):
    created_at = DateFromToRangeFilter()

    class Meta:
        model = Order
        fields = [
            'status', 'delivery', 'branch', 'currency_from',
            'currency_to', 'user', 'created_at',
            'amount_from', 'amount_to'
        ]


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с заказами."""
    
    permission_classes = [IsOwnerOrOperator]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = OrderFilter
    filterset_fields = [
        'status', 'delivery', 'branch', 'currency_from', 'currency_to'
    ]
    search_fields = [
        'id', 'user__email', 'user__first_name', 'user__last_name',
        'branch__name', 'currency_from__code', 'currency_to__code'
    ]
    ordering_fields = ['created_at', 'amount_from', 'amount_to']
    ordering = ['-created_at']
    pagination_class = OrderPagination
    
    def get_queryset(self):
        # Операторы и выше видят все заказы, обычные пользователи - только свои
        if self.request.user.role in ['operator', 'admin', 'owner']:
            return Order.objects.select_related(
                'user', 'branch', 'currency_from', 'currency_to',
                'delivery_address'
            ).prefetch_related('profits__currency')
        else:
            return Order.objects.select_related(
                'user', 'branch', 'currency_from', 'currency_to',
                'delivery_address'
            ).prefetch_related('profits__currency').filter(
                user=self.request.user
            )
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        elif self.action == 'list':
            return OrderListSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        """Создание заказа с привязкой к пользователю."""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Получить заказы текущего пользователя."""
        orders = self.get_queryset()
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Получить ожидающие заказы."""
        orders = self.get_queryset().filter(status='pending')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Получить завершенные заказы."""
        orders = self.get_queryset().filter(status='completed')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def canceled(self, request):
        """Получить отмененные заказы."""
        orders = self.get_queryset().filter(status='canceled')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Отменить заказ."""
        order = self.get_object()
        
        if order.status != 'pending':
            return Response(
                {'error': 'Можно отменить только ожидающий заказ'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'canceled'
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def profits(self, request, pk=None):
        """Получить прибыль по заказу."""
        order = self.get_object()
        profits = order.profits.select_related('currency').all()
        serializer = OrderProfitSerializer(profits, many=True)
        return Response(serializer.data)


class OrderProfitViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для работы с прибылью по заказам."""
    
    serializer_class = OrderProfitSerializer
    permission_classes = [IsOwnerOrOperator]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['order', 'currency']
    ordering_fields = ['amount', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        # Операторы и выше видят все прибыли, обычные пользователи - только по своим заказам
        if self.request.user.role in ['owner']:
            return OrderProfit.objects.select_related('order', 'currency')
        else:
            return OrderProfit.objects.select_related(
                'order', 'currency'
            ).filter(order__user=self.request.user)
