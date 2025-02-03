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
        amount_from = request.data.get('amount_from')
        amount_to = request.data.get('amount_to')

        try:
            if amount_from is not None:
                # Если указана сумма к обмену
                amount_from = float(amount_from)
                amount_to = rate.calculate_to_receive(amount_from)
            elif amount_to is not None:
                # Если указана сумма к получению
                amount_to = float(amount_to)
                amount_from = rate.calculate_to_exchange(amount_to)
            else:
                return Response(
                    {'error': 'Необходимо указать amount_from или amount_to'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response({
                'from_currency': rate.from_currency.code,
                'to_currency': rate.to_currency.code,
                'amount_from': amount_from,
                'amount_to': amount_to,
                'rate': rate.rate,
                'min_amount': rate.min_amount
            })
        except (TypeError, ValueError) as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
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
