from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdministrator, IsOwner
from exchange.models import (
    Currency,
    ExchangeRate,
    ExchangeOffice,
    CurrencyBalance
)
from exchange.serializers import (
    CurrencySerializer,
    ExchangeRateSerializer,
    ExchangeOfficeSerializer,
    CurrencyBalanceSerializer
)
from exchange.services import calculate_exchange


class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdministrator | IsOwner]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class ExchangeRateViewSet(viewsets.ModelViewSet):
    queryset = ExchangeRate.objects.filter(is_active=True)
    serializer_class = ExchangeRateSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdministrator | IsOwner]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'])
    def calculate(self, request, pk=None):
        """Расчет суммы обмена"""
        rate = self.get_object()
        data = request.data
        try:
            result = calculate_exchange(
                rate,
                amount_from=data.get('amount_from'),
                amount_to=data.get('amount_to'),
            )
            return Response(result)
        except Exception as exc:
            return Response(
                {'error': str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ExchangeOfficeViewSet(viewsets.ModelViewSet):
    queryset = ExchangeOffice.objects.all()
    serializer_class = ExchangeOfficeSerializer

    def get_permissions(self):
        """Только владелец может управлять обменными пунктами"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsOwner]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True)
    def balances(self, request, pk=None):
        """Получение всех балансов для конкретного обменного пункта"""
        office = self.get_object()
        balances = office.balances.all()
        serializer = CurrencyBalanceSerializer(balances, many=True)
        return Response(serializer.data)


class CurrencyBalanceViewSet(viewsets.ModelViewSet):
    serializer_class = CurrencyBalanceSerializer
    permission_classes = [IsOwner]  # Только владелец может управлять балансами

    def get_queryset(self):
        return CurrencyBalance.objects.select_related('currency', 'office')

    @action(detail=False)
    def by_office(self, request):
        """Получение балансов по ID обменного пункта"""
        office_id = request.query_params.get('office_id')
        if office_id:
            balances = self.get_queryset().filter(office_id=office_id)
            serializer = self.get_serializer(balances, many=True)
            return Response(serializer.data)
        return Response({"error": "Требуется параметр office_id"}, status=400)
