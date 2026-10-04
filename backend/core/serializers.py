from rest_framework import serializers
from .models import Address, CurrencyMovement


class AddressSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Address"""
    
    class Meta:
        model = Address
        fields = [
            'id', 'country', 'city', 'street', 'house_number',
            'postal_code', 'full_address', 'latitude', 'longitude',
            'created_at'
        ]


class AddressCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания адреса"""
    
    class Meta:
        model = Address
        fields = [
            'country', 'city', 'street', 'house_number',
            'postal_code', 'full_address', 'latitude', 'longitude'
        ]


class AddressUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления адреса"""
    
    class Meta:
        model = Address
        fields = [
            'country', 'city', 'street', 'house_number',
            'postal_code', 'full_address', 'latitude', 'longitude'
        ]


class CurrencyMovementSerializer(serializers.ModelSerializer):
    """Сериализатор для модели CurrencyMovement"""
    currency_code = serializers.CharField(source='currency.code', read_only=True)
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = CurrencyMovement
        fields = [
            'id', 'branch', 'currency', 'user', 'order', 'purchase',
            'referral_transaction', 'type', 'amount', 'reason',
            'created_at', 'currency_code', 'branch_name', 'user_email'
        ]
        read_only_fields = ['id', 'created_at']


class CurrencyMovementCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания движения валюты"""
    
    class Meta:
        model = CurrencyMovement
        fields = [
            'branch', 'currency', 'user', 'order', 'purchase',
            'referral_transaction', 'type', 'amount', 'reason'
        ]


class CurrencyMovementUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления движения валюты"""
    
    class Meta:
        model = CurrencyMovement
        fields = ['amount', 'reason'] 