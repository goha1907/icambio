from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Currency, ExchangeRate, Purchase
from .serializers import (
    CurrencySerializer, CurrencyCreateSerializer, CurrencyUpdateSerializer,
    ExchangeRateSerializer, ExchangeRateCreateSerializer, ExchangeRateUpdateSerializer,
    PurchaseSerializer, PurchaseCreateSerializer, PurchaseUpdateSerializer
)


class CurrencyViewSet(viewsets.ModelViewSet):
    """ViewSet для управления валютами"""
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name']
    ordering = ['code']

    def get_serializer_class(self):
        if self.action == 'create':
            return CurrencyCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CurrencyUpdateSerializer
        return CurrencySerializer


class ExchangeRateViewSet(viewsets.ModelViewSet):
    """ViewSet для управления курсами обмена"""
    queryset = ExchangeRate.objects.select_related('from_currency', 'to_currency')
    serializer_class = ExchangeRateSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['from_currency', 'to_currency', 'visible']
    search_fields = ['from_currency__code', 'to_currency__code']
    ordering_fields = ['rate', 'created_at', 'updated_at']
    ordering = ['-updated_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return ExchangeRateCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ExchangeRateUpdateSerializer
        return ExchangeRateSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    """ViewSet для управления закупками валют"""
    queryset = Purchase.objects.select_related('branch', 'currency')
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['branch', 'currency', 'purchase_date']
    search_fields = ['currency__code', 'branch__name', 'notes']
    ordering_fields = ['purchase_date', 'amount', 'rate', 'total_cost']
    ordering = ['-purchase_date']

    def get_serializer_class(self):
        if self.action == 'create':
            return PurchaseCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return PurchaseUpdateSerializer
        return PurchaseSerializer
