from rest_framework import serializers
from django.db import transaction
from orders.models import Order, OrderDocument, OrderItem, Review
from exchange.models import ExchangeRate


class OrderItemSerializer(serializers.ModelSerializer):
    amount_from_formatted = serializers.SerializerMethodField()
    amount_to_formatted = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'from_currency', 'to_currency',
                  'amount_from', 'amount_to', 'rate']

    def get_amount_from_formatted(self, obj):
        return obj.get_formatted_amount_from()

    def get_amount_to_formatted(self, obj):
        return obj.get_formatted_amount_to()

    def validate(self, data):
        """Валидация курса и сумм"""
        # Проверяем существование активного курса
        try:
            exchange_rate = ExchangeRate.objects.get(
                from_currency=data['from_currency'],
                to_currency=data['to_currency'],
                is_active=True
            )
        except ExchangeRate.DoesNotExist:
            raise serializers.ValidationError(
                "Нет активного курса для данной валютной пары"
            )

        # Проверяем соответствие курса
        if exchange_rate.rate != data['rate']:
            raise serializers.ValidationError(
                "Курс обмена изменился. Пожалуйста, обновите страницу"
            )

        # Проверяем минимальную сумму
        if data['amount_from'] < exchange_rate.min_amount:
            raise serializers.ValidationError(
                f"Минимальная сумма обмена: {exchange_rate.min_amount}"
            )

        # Проверяем корректность расчета
        expected_amount = round(
            data['amount_from'] * data['rate'],
            data['to_currency'].decimal_places
        )
        if abs(expected_amount - data['amount_to']) > 0.00000001:
            raise serializers.ValidationError(
                "Сумма к получению рассчитана неверно"
            )

        return data


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id', 'tracking_code', 'office', 'user',
            'status', 'status_display',
            'whatsapp', 'telegram', 'needs_delivery', 'delivery_address',
            'comment', 'created_at', 'items',
            'total_from_amount', 'total_to_amount'
        ]
        read_only_fields = ['tracking_code', 'status', 'user', 'created_at',
                            'total_from_amount', 'total_to_amount']

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order

    def to_representation(self, instance):
        """Добавляем дополнительную информацию при отображении"""
        data = super().to_representation(instance)
        data['total_items'] = instance.items.count()
        data['status_display'] = instance.get_status_display()
        return data


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']

    def validate_status(self, value):
        instance = self.instance
        if not instance.can_transition_to(value):
            current_status = instance.get_status_display()
            new_status = dict(Order.STATUS_CHOICES)[value]
            raise serializers.ValidationError(
                f"Невозможно изменить статус с '{current_status}' "
                f"на '{new_status}'. "
                f"Доступные статусы: {[dict(Order.STATUS_CHOICES)[status] for status in Order.STATUS_FLOW[instance.status]]}"
            )
        return value


class OrderTrackingSerializer(serializers.ModelSerializer):
    """Сериализатор для отслеживания заказа по коду"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            'tracking_code', 'status', 'status_display',
            'created_at', 'items'
        ]


class OrderDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDocument
        fields = ['id', 'document_type', 'file', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'order', 'rating', 'text',
                  'created_at', 'is_published']
        read_only_fields = ['created_at', 'is_published']


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания отзыва"""
    class Meta:
        model = Review
        fields = ['order', 'rating', 'text']

    def validate_order(self, value):
        """Проверка что заказ принадлежит пользователю и завершен"""
        user = self.context['request'].user
        if value.user != user:
            raise serializers.ValidationError(
                "Вы не можете оставить отзыв к чужому заказу"
            )
        if value.status != 'completed':
            raise serializers.ValidationError(
                "Отзыв можно оставить только к завершенному заказу"
            )
        if Review.objects.filter(order=value).exists():
            raise serializers.ValidationError(
                "Отзыв к этому заказу уже существует"
            )
        return value


class ReviewDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детального отображения отзыва"""
    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'order', 'rating', 'text', 'created_at',
                  'is_visible', 'display_name']
        read_only_fields = ['created_at', 'display_name']


class ReviewPublicSerializer(serializers.ModelSerializer):
    """Сериализатор для публичного отображения отзыва"""
    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = Review
        fields = ['rating', 'text', 'created_at', 'display_name']
