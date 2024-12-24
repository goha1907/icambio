from rest_framework import serializers
from .models import Order, OrderItem, Review
from exchange.serializers import BranchSerializer
from exchange.models import ExchangeRate


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'from_currency', 'to_currency', 'from_amount', 'to_amount', 'rate']
        read_only_fields = ['rate']

    def validate(self, attrs):
        # Проверяем существование курса обмена
        try:
            rate = ExchangeRate.objects.get(
                branch=self.context['order'].branch,
                from_currency=attrs['from_currency'],
                to_currency=attrs['to_currency'],
                is_active=True
            )
            attrs['rate'] = rate.rate
            attrs['to_amount'] = attrs['from_amount'] * rate.rate
        except ExchangeRate.DoesNotExist:
            raise serializers.ValidationError(
                "Курс обмена для указанной пары валют не найден"
            )
        return attrs


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    branch_details = BranchSerializer(source='branch', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'branch', 'branch_details',
                  'status', 'status_display',
                  'client_email', 'client_phone',
                  'items', 'created_at', 'updated_at'
                  ]
        read_only_fields = ['status', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'order', 'text', 'created_at', 'user']
        read_only_fields = ['created_at']

    def get_user(self, obj):
        return obj.order.user.username if obj.order.user else None

    def validate_order(self, value):
        if value.status != 'COMPLETED':
            raise serializers.ValidationError(
                "Отзыв можно оставить только к выполненному заказу"
            )
        return value
