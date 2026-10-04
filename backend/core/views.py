
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsOperator, IsOperator
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
    permission_classes = [IsOperator]
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter
    ]
    filterset_fields = ['country', 'city']
    search_fields = [
        'street', 'city', 'country', 'full_address', 'house_number'
    ]
    ordering_fields = ['city', 'country', 'created_at']
    ordering = ['country', 'city']

    def get_serializer_class(self):
        if self.action == 'create':
            return AddressCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AddressUpdateSerializer
        return AddressSerializer


class CurrencyMovementViewSet(viewsets.ModelViewSet):
    """ViewSet для управления движениями валют"""
    queryset = CurrencyMovement.objects.select_related(
        'branch', 'currency', 'user', 'order', 'purchase',
        'referral_transaction'
    )
    serializer_class = CurrencyMovementSerializer
    permission_classes = [IsOperator]
    filter_backends = [
        DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter
    ]
    filterset_fields = [
        'branch', 'currency', 'type', 'user', 'order', 'purchase'
    ]
    search_fields = [
        'currency__code', 'branch__name', 'reason', 'user__email'
    ]
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return CurrencyMovementCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CurrencyMovementUpdateSerializer
        return CurrencyMovementSerializer
