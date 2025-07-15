
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Address, CurrencyMovement
from .serializers import (
    AddressSerializer, AddressCreateSerializer, AddressUpdateSerializer,
    CurrencyMovementSerializer, CurrencyMovementCreateSerializer,
    CurrencyMovementUpdateSerializer
)


class AddressViewSet(viewsets.ModelViewSet):
    """ViewSet для управления адресами"""
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['country', 'city', 'state']
    search_fields = ['street', 'city', 'state', 'country', 'full_address']
    ordering_fields = ['city', 'state', 'country']
    ordering = ['country', 'city']

    def get_serializer_class(self):
        if self.action == 'create':
            return AddressCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AddressUpdateSerializer
        return AddressSerializer


class CurrencyMovementViewSet(viewsets.ModelViewSet):
    """ViewSet для управления движениями валют"""
    queryset = CurrencyMovement.objects.select_related('branch', 'currency')
    serializer_class = CurrencyMovementSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['branch', 'currency', 'movement_type', 'movement_date']
    search_fields = ['currency__code', 'branch__name', 'notes']
    ordering_fields = ['movement_date', 'amount', 'balance_before', 'balance_after']
    ordering = ['-movement_date']

    def get_serializer_class(self):
        if self.action == 'create':
            return CurrencyMovementCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CurrencyMovementUpdateSerializer
        return CurrencyMovementSerializer
