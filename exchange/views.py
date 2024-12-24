import decimal
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q
from .models import Currency, Branch, ExchangeRate, CurrencyBalance
from .serializers import (
    CurrencySerializer,
    BranchSerializer,
    ExchangeRateSerializer,
    CurrencyBalanceSerializer,
    ExchangeCalculatorSerializer
)


class CurrencyViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с валютами"""
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()


class BranchViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с филиалами"""
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Branch.objects.all()
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__iexact=city)
        return queryset.filter(is_active=True)

    @action(detail=True, methods=['post'])
    def set_favorite(self, request, pk=None):
        """Добавление филиала в избранное"""
        branch = self.get_object()
        request.user.favorite_branch = branch
        request.user.save()
        return Response({'status': 'Branch set as favorite'})


class ExchangeRateViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с курсами обмена"""
    queryset = ExchangeRate.objects.all()
    serializer_class = ExchangeRateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ExchangeRate.objects.filter(is_active=True)
        branch_id = self.request.query_params.get('branch', None)
        if branch_id:
            queryset = queryset.filter(branch_id=branch_id)
        return queryset

    @action(detail=False, methods=['post'])
    def calculate_exchange(self, request):
        """Расчет обмена валют"""
        serializer = ExchangeCalculatorSerializer(data=request.data)
        if serializer.is_valid():
            try:
                rate = ExchangeRate.objects.get(
                    branch_id=serializer.validated_data['branch_id'],
                    from_currency__code=serializer.validated_data['from_currency'],
                    to_currency__code=serializer.validated_data['to_currency'],
                    is_active=True
                )

                amount = serializer.validated_data['amount']
                result = {
                    'from_amount': amount,
                    'to_amount': amount * rate.rate,
                    'rate': rate.rate,
                    'min_amount': rate.min_amount
                }
                return Response(result)
            except ExchangeRate.DoesNotExist:
                return Response(
                    {'error': 'Exchange rate not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrencyBalanceViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с балансами валют"""
    queryset = CurrencyBalance.objects.all()
    serializer_class = CurrencyBalanceSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        if not self.request.user.is_staff:
            return CurrencyBalance.objects.none()

        queryset = CurrencyBalance.objects.all()
        branch_id = self.request.query_params.get('branch', None)
        if branch_id:
            queryset = queryset.filter(branch_id=branch_id)
        return queryset

    @action(detail=True, methods=['post'])
    def update_balance(self, request, pk=None):
        """Обновление баланса валюты"""
        balance = self.get_object()

        try:
            # Преобразуем входные данные в Decimal
            amount = decimal.Decimal(str(request.data.get('amount', '0')))
            rate = decimal.Decimal(str(request.data.get('rate', '0')))

            # Преобразуем значения из модели в Decimal
            current_amount = decimal.Decimal(str(balance.amount))
            current_rate = decimal.Decimal(str(balance.average_purchase_rate))

            if amount <= 0 or rate <= 0:
                return Response(
                    {'error': 'Invalid amount or rate'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Вычисляем новые значения
            total_value = (current_amount * current_rate) + (amount * rate)
            new_amount = current_amount + amount
            new_average_rate = total_value / new_amount if new_amount > 0 else rate

            # Сохраняем обновленные значения
            balance.amount = new_amount
            balance.average_purchase_rate = new_average_rate
            balance.save()

            return Response(self.get_serializer(balance).data)

        except (decimal.InvalidOperation, TypeError) as e:
            return Response(
                {'error': f'Invalid numeric values: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
