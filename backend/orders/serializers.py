from rest_framework import serializers
from orders.models import Order, OrderProfit
from users.models import User
from branches.models import Branch
from exchange.models import Currency
from core.models import Address


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для пользователя в заказе."""

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class BranchSerializer(serializers.ModelSerializer):
    """Сериализатор для филиала в заказе."""
    
    class Meta:
        model = Branch
        fields = ['id', 'name', 'email']


class CurrencySerializer(serializers.ModelSerializer):
    """Сериализатор для валюты в заказе."""
    
    class Meta:
        model = Currency
        fields = ['id', 'code', 'name', 'symbol']


class AddressSerializer(serializers.ModelSerializer):
    """Сериализатор для адреса доставки."""
    
    class Meta:
        model = Address
        fields = [
            'id', 'country', 'city', 'street', 'house_number',
            'postal_code', 'full_address', 'latitude', 'longitude'
        ]


class OrderProfitSerializer(serializers.ModelSerializer):
    """Сериализатор для прибыли по заказу."""
    
    currency = CurrencySerializer(read_only=True)
    
    class Meta:
        model = OrderProfit
        fields = ['id', 'currency', 'amount', 'created_at']
        read_only_fields = ['created_at']


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для заказа."""
    
    user = UserSerializer(read_only=True)
    branch = BranchSerializer(read_only=True)
    currency_from = CurrencySerializer(read_only=True)
    currency_to = CurrencySerializer(read_only=True)
    delivery_address = AddressSerializer(read_only=True)
    profits = OrderProfitSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'branch', 'currency_from', 'currency_to',
            'amount_from', 'amount_to', 'applied_rate', 'status',
            'delivery', 'delivery_address', 'created_at', 'completed_at',
            'profits', 'is_completed', 'is_canceled', 'is_pending'
        ]
        read_only_fields = [
            'id', 'user', 'amount_to', 'applied_rate', 'created_at',
            'completed_at', 'profits', 'is_completed', 'is_canceled',
            'is_pending'
        ]


class OrderListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка заказов."""
    
    currency_from = CurrencySerializer(read_only=True)
    currency_to = CurrencySerializer(read_only=True)
    branch = BranchSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'currency_from', 'currency_to', 'branch',
            'amount_from', 'amount_to', 'status', 'delivery',
            'created_at', 'is_completed', 'is_canceled', 'is_pending'
        ]
        read_only_fields = [
            'id', 'amount_to', 'created_at', 'is_completed',
            'is_canceled', 'is_pending'
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания заказа."""
    
    delivery_address = AddressSerializer(required=False)

    class Meta:
        model = Order
        fields = [
            'branch', 'currency_from', 'currency_to', 'amount_from',
            'delivery', 'delivery_address'
        ]

    def validate(self, data):
        """Валидация данных заказа."""
        currency_from = data.get('currency_from')
        currency_to = data.get('currency_to')
        amount_from = data.get('amount_from')
        branch = data.get('branch')
        
        # Проверяем, что валюты разные
        if currency_from == currency_to:
            raise serializers.ValidationError(
                "Валюты обмена должны быть разными"
            )
        
        # Проверяем, что сумма положительная
        if amount_from <= 0:
            raise serializers.ValidationError(
                "Сумма обмена должна быть положительной"
            )
        
        # Проверяем, что филиал активен
        if not branch.is_active:
            raise serializers.ValidationError(
                "Выбранный филиал неактивен"
            )
        
        return data
    
    def create(self, validated_data):
        """Создание заказа с автоматическим расчетом."""
        delivery_address_data = validated_data.pop('delivery_address', None)
        user = self.context['request'].user
        
        # Создаем адрес доставки, если передан
        delivery_address = None
        if delivery_address_data:
            delivery_address = Address.objects.create(**delivery_address_data)
        
        # Получаем курс обмена
        currency_from = validated_data['currency_from']
        currency_to = validated_data['currency_to']
        branch = validated_data['branch']
        amount_from = validated_data['amount_from']
        
        # Ищем подходящий курс
        from exchange.models import ExchangeRate
        from django.db.models import Q
        
        rate_obj = ExchangeRate.objects.filter(
            currency_from=currency_from,
            currency_to=currency_to,
            branch=branch,
            visible=True,
            min_amount__lte=amount_from
        ).filter(
            Q(max_amount__isnull=True) | Q(max_amount__gte=amount_from)
        ).first()
        
        if not rate_obj:
            raise serializers.ValidationError(
                "Курс обмена не найден для указанной суммы"
            )
        
        # Рассчитываем сумму к получению
        amount_to = amount_from * rate_obj.rate
        
        # Создаем заказ
        order = Order.objects.create(
            user=user,
            branch=branch,
            currency_from=currency_from,
            currency_to=currency_to,
            amount_from=amount_from,
            amount_to=amount_to,
            applied_rate=rate_obj.rate,
            delivery=validated_data.get('delivery', False),
            delivery_address=delivery_address
        )
        
        return order


class OrderUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления заказа."""

    class Meta:
        model = Order
        fields = ['status']
    
    def validate_status(self, value):
        """Валидация изменения статуса."""
        current_status = self.instance.status
        
        # Разрешенные переходы статусов
        allowed_transitions = {
            'pending': ['completed', 'canceled'],
            'completed': [],  # Завершенный заказ нельзя изменить
            'canceled': [],   # Отмененный заказ нельзя изменить
        }
        
        if value not in allowed_transitions.get(current_status, []):
            raise serializers.ValidationError(
                f"Нельзя изменить статус с '{current_status}' на '{value}'"
            )
        
        return value
