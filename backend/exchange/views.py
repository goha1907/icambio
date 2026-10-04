from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsOperator, IsOperator, IsOperator
from .models import Currency, ExchangeRate, Purchase
from .serializers import (
    CurrencySerializer, CurrencyCreateSerializer, CurrencyUpdateSerializer,
    ExchangeRateSerializer, ExchangeRateCreateSerializer,
    ExchangeRateUpdateSerializer, PurchaseSerializer, PurchaseCreateSerializer,
    PurchaseUpdateSerializer
)


class CurrencyViewSet(viewsets.ModelViewSet):
    """ViewSet для управления валютами"""
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = [IsOperator]
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter
    ]
    filterset_fields = ['code', 'name']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name', 'created_at']
    ordering = ['code']

    def get_serializer_class(self):
        if self.action == 'create':
            return CurrencyCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CurrencyUpdateSerializer
        return CurrencySerializer


class ExchangeRateViewSet(viewsets.ModelViewSet):
    """ViewSet для управления курсами обмена"""
    queryset = ExchangeRate.objects.select_related(
        'currency_from', 'currency_to', 'branch'
    )
    serializer_class = ExchangeRateSerializer
    permission_classes = [IsOperator]
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter
    ]
    filterset_fields = [
        'currency_from', 'currency_to', 'branch', 'visible', 'is_hot',
        'in_filter'
    ]
    search_fields = [
        'currency_from__code', 'currency_to__code', 'branch__name'
    ]
    ordering_fields = ['rate', 'min_amount', 'max_amount', 'updated_at']
    ordering = ['-updated_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return ExchangeRateCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ExchangeRateUpdateSerializer
        return ExchangeRateSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    """ViewSet для управления закупками валют"""
    queryset = Purchase.objects.select_related(
        'branch', 'currency_from', 'currency_to', 'user'
    )
    serializer_class = PurchaseSerializer
    permission_classes = [IsOperator]
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter
    ]
    filterset_fields = [
        'branch', 'currency_from', 'currency_to', 'source', 'user'
    ]
    search_fields = [
        'currency_from__code', 'currency_to__code', 'branch__name', 'note'
    ]
    ordering_fields = [
        'created_at', 'amount_from', 'amount_to', 'applied_rate'
    ]
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return PurchaseCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return PurchaseUpdateSerializer
        return PurchaseSerializer
