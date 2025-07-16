from rest_framework import serializers
from django.contrib.auth import get_user_model
from core.models import Address
from .models import ReferralTransaction

User = get_user_model()


class AddressSerializer(serializers.ModelSerializer):
    """Сериализатор для адреса."""
    
    class Meta:
        model = Address
        fields = [
            'id', 'country', 'city', 'street', 'house_number',
            'postal_code', 'full_address', 'latitude', 'longitude'
        ]


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для пользователя."""
    
    address = AddressSerializer(read_only=True)
    referral_link = serializers.CharField(read_only=True)
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'whatsapp', 'telegram', 'referral_code', 'referred_by_code',
            'referral_amount', 'address', 'role', 'created_at',
            'referral_link', 'full_name'
        ]
        read_only_fields = [
            'id', 'email', 'referral_code', 'referral_amount',
            'role', 'created_at', 'referral_link', 'full_name'
        ]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления профиля пользователя."""
    
    address = AddressSerializer(required=False)
    
    class Meta:
        model = User
        fields = [
            'username', 'first_name', 'last_name', 'whatsapp',
            'telegram', 'address'
        ]

    def validate_username(self, value):
        if User.objects.exclude(pk=self.instance.pk).filter(
            username=value
        ).exists():
            raise serializers.ValidationError("Этот никнейм уже занят")
        return value

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        
        # Обновляем адрес, если передан
        if address_data:
            if instance.address:
                for attr, value in address_data.items():
                    setattr(instance.address, attr, value)
                instance.address.save()
            else:
                instance.address = Address.objects.create(**address_data)
        
        # Обновляем пользователя
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance


class UserCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания пользователя."""
    
    password = serializers.CharField(write_only=True)
    referred_by_code = serializers.CharField(required=False, write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'username', 'first_name', 'last_name',
            'whatsapp', 'telegram', 'referred_by_code'
        ]
    
    def validate_referred_by_code(self, value):
        if value and not User.objects.filter(
            referral_code=value
        ).exists():
            raise serializers.ValidationError("Неверный реферальный код")
        return value
    
    def create(self, validated_data):
        referred_by_code = validated_data.pop('referred_by_code', None)
        password = validated_data.pop('password')
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        
        if referred_by_code:
            user.referred_by_code = referred_by_code
        
        user.save()
        return user


class ReferralTransactionSerializer(serializers.ModelSerializer):
    """Сериализатор для модели ReferralTransaction"""
    referrer_email = serializers.CharField(source='referrer.email', read_only=True)
    referred_email = serializers.CharField(source='referred.email', read_only=True)
    
    class Meta:
        model = ReferralTransaction
        fields = [
            'id', 'referrer', 'referred', 'amount', 'status',
            'created_at', 'referrer_email', 'referred_email'
        ]
        read_only_fields = ['id', 'created_at']


class ReferralTransactionCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания реферальной транзакции"""
    
    class Meta:
        model = ReferralTransaction
        fields = ['referrer', 'referred', 'amount', 'status']


class ReferralTransactionUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления реферальной транзакции"""
    
    class Meta:
        model = ReferralTransaction
        fields = ['status']
