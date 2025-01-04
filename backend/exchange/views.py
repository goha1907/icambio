import decimal
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.cache import cache
from django_filters import rest_framework as filters
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from django.db.models import Q
from orders.models import Order
from .models import Currency, Branch, ExchangeRate, CurrencyBalance
from .serializers import (
    CurrencySerializer,
    BranchSerializer,
    BranchDetailSerializer,
    BranchCreateUpdateSerializer,
    ExchangeRateSerializer,
    CurrencyBalanceSerializer,
    ExchangeCalculatorSerializer,
    UserSerializer
)

User = get_user_model()


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
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return BranchDetailSerializer
        return BranchCreateUpdateSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Branch.objects.all()

        # Фильтрация по городу
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__iexact=city)

        # Показываем неактивные филиалы только администраторам
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)

        return queryset

    @action(detail=True, methods=['post'])
    def set_favorite(self, request, pk=None):
        """Добавление филиала в избранное"""
        branch = self.get_object()
        request.user.favorite_branch = branch
        request.user.save()
        return Response({'status': 'Branch set as favorite'})

    @action(detail=True, methods=['post'])
    def add_exchange_rate(self, request, pk=None):
        """Добавление курса обмена для филиала"""
        branch = self.get_object()
        serializer = ExchangeRateSerializer(data={**request.data, 'branch': branch.id})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_currency_balance(self, request, pk=None):
        """Обновление остатка валюты в филиале"""
        branch = self.get_object()

        serializer = CurrencyBalanceSerializer(data={**request.data, 'branch': branch.id})
        if serializer.is_valid():
            try:
                balance = CurrencyBalance.objects.get(
                    branch=branch,
                    currency_id=request.data.get('currency')
                )
                # Обновляем существующий баланс
                serializer = CurrencyBalanceSerializer(
                    balance,
                    data=request.data,
                    partial=True
                )
            except CurrencyBalance.DoesNotExist:
                pass

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Получение статистики по филиалу"""
        branch = self.get_object()
        today = timezone.now()

        stats = {
            'total_orders': Order.objects.filter(branch=branch).count(),
            'today_orders': Order.objects.filter(
                branch=branch,
                created_at__date=today.date()
            ).count(),
            'active_rates': ExchangeRate.objects.filter(
                branch=branch,
                is_active=True
            ).count(),
            'currency_balances': CurrencyBalance.objects.filter(
                branch=branch
            ).values('currency__code', 'amount')
        }

        return Response(stats)


class ExchangeRateFilter(filters.FilterSet):
    min_rate = filters.NumberFilter(field_name="rate", lookup_expr='gte')
    max_rate = filters.NumberFilter(field_name="rate", lookup_expr='lte')

    class Meta:
        model = ExchangeRate
        fields = ['branch', 'from_currency', 'to_currency', 'is_active']


class ExchangeRateViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с курсами обмена"""
    queryset = ExchangeRate.objects.all()
    serializer_class = ExchangeRateSerializer
    permission_classes = [IsAuthenticated]
    filter_class = ExchangeRateFilter

    def get_queryset(self):
        queryset = super().get_queryset()
        cache_key = f'exchange_rates_{self.request.query_params}'
        cached_data = cache.get(cache_key)

        if cached_data is None:
            cached_data = queryset
            cache.set(cache_key, cached_data, timeout=300)

        return cached_data

    def perform_create(self, serializer):
        try:
            serializer.save()
        except ValidationError as e:
            raise DRFValidationError(detail=str(e))

    @action(detail=False, methods=['post'])
    def calculate_exchange(self, request):
        """Расчет обмена валют"""
        serializer = ExchangeCalculatorSerializer(data=request.data)
        if serializer.is_valid():
            try:
                rate = ExchangeRate.objects.select_related(
                    'from_currency', 'to_currency'
                ).get(
                    branch_id=serializer.validated_data['branch_id'],
                    from_currency__code=serializer.validated_data['from_currency'],
                    to_currency__code=serializer.validated_data['to_currency'],
                    is_active=True
                )

                amount = decimal.Decimal(str(serializer.validated_data['amount']))
                if amount < rate.min_amount:
                    return Response(
                        {'error': f'Minimum amount is {rate.min_amount}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

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
            except decimal.InvalidOperation:
                return Response(
                    {'error': 'Invalid amount format'},
                    status=status.HTTP_400_BAD_REQUEST
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


class CityListView(APIView):
    """Получение списка городов"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cities = Branch.objects.values_list('city', flat=True).distinct()
        return Response(sorted(cities))
