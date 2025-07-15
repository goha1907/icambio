from rest_framework import serializers
from .models import Address, CurrencyMovement


class AddressSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Address"""
    
    class Meta:
        model = Address
        fields = [
            'id', 'street', 'city', 'state', 'postal_code', 
            'country', 'full_address'
        ]


class AddressCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания адреса"""
    
    class Meta:
        model = Address
        fields = [
            'street', 'city', 'state', 'postal_code', 
            'country', 'full_address'
        ]


class AddressUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления адреса"""
    
    class Meta:
        model = Address
        fields = [
            'street', 'city', 'state', 'postal_code', 
            'country', 'full_address'
        ]


class CurrencyMovementSerializer(serializers.ModelSerializer):
    """Сериализатор для модели CurrencyMovement"""
    currency_code = serializers.CharField(source='currency.code', read_only=True)
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    
    class Meta:
        model = CurrencyMovement
        fields = [
            'id', 'branch', 'currency', 'movement_type', 'amount',
            'balance_before', 'balance_after', 'movement_date', 'notes',
            'currency_code', 'branch_name'
        ]
        read_only_fields = ['id', 'movement_date']


class CurrencyMovementCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания движения валюты"""
    
    class Meta:
        model = CurrencyMovement
        fields = [
            'branch', 'currency', 'movement_type', 'amount',
            'balance_before', 'balance_after', 'notes'
        ]


class CurrencyMovementUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления движения валюты"""
    
    class Meta:
        model = CurrencyMovement
        fields = ['amount', 'balance_before', 'balance_after', 'notes'] 