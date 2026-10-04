from rest_framework import serializers
from reviews.models import Review
from users.models import User
from orders.models import Order


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для пользователя в отзыве."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для заказа в отзыве."""
    
    class Meta:
        model = Order
        fields = ['id', 'amount_from', 'amount_to']


class ReviewSerializer(serializers.ModelSerializer):
    """Сериализатор для отзыва."""
    
    user = UserSerializer(read_only=True)
    order = OrderSerializer(read_only=True)
    user_name = serializers.CharField(read_only=True)
    order_summary = serializers.CharField(read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'user', 'order', 'rating', 'comment', 'visible',
            'created_at', 'user_name', 'order_summary'
        ]
        read_only_fields = [
            'id', 'user', 'order', 'created_at', 'user_name', 'order_summary'
        ]


class ReviewListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка отзывов."""
    
    user = UserSerializer(read_only=True)
    order = OrderSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'user', 'order', 'rating', 'comment', 'visible',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'order', 'created_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания отзыва."""
    
    class Meta:
        model = Review
        fields = ['order', 'rating', 'comment']
    
    def validate_order(self, value):
        """Проверка что заказ принадлежит пользователю и завершен."""
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
    
    def validate_rating(self, value):
        """Проверка рейтинга."""
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Рейтинг должен быть от 1 до 5"
            )
        return value


class ReviewUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления отзыва."""
    
    class Meta:
        model = Review
        fields = ['rating', 'comment']
    
    def validate_rating(self, value):
        """Проверка рейтинга."""
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Рейтинг должен быть от 1 до 5"
            )
        return value


class ReviewPublicSerializer(serializers.ModelSerializer):
    """Сериализатор для публичного отображения отзыва."""
    
    user_name = serializers.CharField(read_only=True)
    order_summary = serializers.CharField(read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'rating', 'comment', 'created_at',
            'user_name', 'order_summary'
        ]
        read_only_fields = [
            'id', 'created_at', 'user_name', 'order_summary'
        ] 