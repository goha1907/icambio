from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from branches.models import Branch, BranchHours, BranchCurrency
from branches.serializers import (
    BranchSerializer, BranchListSerializer, BranchHoursSerializer,
    BranchCurrencySerializer
)


class BranchViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для работы с филиалами."""
    
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'email', 'address__city', 'address__country']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        return Branch.objects.select_related('address').prefetch_related(
            'hours', 'currencies__currency'
        ).filter(is_active=True)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BranchListSerializer
        return BranchSerializer
    
    @action(detail=True, methods=['get'])
    def hours(self, request, pk=None):
        """Получить график работы филиала."""
        branch = self.get_object()
        hours = branch.hours.all()
        serializer = BranchHoursSerializer(hours, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def currencies(self, request, pk=None):
        """Получить валюты филиала."""
        branch = self.get_object()
        currencies = branch.currencies.select_related('currency').all()
        serializer = BranchCurrencySerializer(currencies, many=True)
        return Response(serializer.data)


class BranchHoursViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для работы с графиком работы филиалов."""
    
    serializer_class = BranchHoursSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['branch', 'weekday', 'is_open']
    
    def get_queryset(self):
        return BranchHours.objects.select_related('branch').all()


class BranchCurrencyViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для работы с валютами филиалов."""
    
    serializer_class = BranchCurrencySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['branch', 'currency']
    
    def get_queryset(self):
        return BranchCurrency.objects.select_related(
            'branch', 'currency'
        ).all()
