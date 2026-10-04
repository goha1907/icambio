from rest_framework import serializers
from .models import Currency, ExchangeRate, Purchase


class CurrencySerializer(serializers.ModelSerializer):
    """Сериализатор для модели Currency"""
    
    class Meta:
        model = Currency
        fields = [
            'id', 'code', 'name', 'symbol', 'decimal_places', 'created_at'
        ]


class CurrencyCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания валюты"""
    
    class Meta:
        model = Currency
        fields = ['code', 'name', 'symbol', 'decimal_places']


class CurrencyUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления валюты"""
    
    class Meta:
        model = Currency
        fields = ['name', 'symbol', 'decimal_places']


class ExchangeRateSerializer(serializers.ModelSerializer):
    """Сериализатор для модели ExchangeRate"""
    currency_from_code = serializers.CharField(
        source='currency_from.code', read_only=True
    )
    currency_to_code = serializers.CharField(
        source='currency_to.code', read_only=True
    )
    branch_name = serializers.CharField(
        source='branch.name', read_only=True
    )

    class Meta:
        model = ExchangeRate
        fields = [
            'id', 'currency_from', 'currency_to', 'branch', 'min_amount',
            'max_amount', 'rate', 'is_hot', 'visible', 'in_filter',
            'updated_at', 'currency_from_code', 'currency_to_code',
            'branch_name'
        ]
        read_only_fields = ['id', 'updated_at']


class ExchangeRateCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания курса обмена"""
    
    class Meta:
        model = ExchangeRate
        fields = [
            'currency_from', 'currency_to', 'branch', 'min_amount',
            'max_amount', 'rate', 'is_hot', 'visible', 'in_filter'
        ]


class ExchangeRateUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления курса обмена"""
    
    class Meta:
        model = ExchangeRate
        fields = [
            'min_amount', 'max_amount', 'rate', 'is_hot', 'visible',
            'in_filter'
        ]


class PurchaseSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Purchase"""
    currency_from_code = serializers.CharField(
        source='currency_from.code', read_only=True
    )
    currency_to_code = serializers.CharField(
        source='currency_to.code', read_only=True
    )
    branch_name = serializers.CharField(
        source='branch.name', read_only=True
    )
    user_email = serializers.CharField(
        source='user.email', read_only=True
    )
    
    class Meta:
        model = Purchase
        fields = [
            'id', 'branch', 'currency_from', 'currency_to', 'amount_from',
            'amount_to', 'applied_rate', 'source', 'user', 'note',
            'created_at', 'currency_from_code', 'currency_to_code',
            'branch_name', 'user_email'
        ]
        read_only_fields = ['id', 'created_at']


class PurchaseCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания закупки"""

    class Meta:
        model = Purchase
        fields = [
            'branch', 'currency_from', 'currency_to', 'amount_from',
            'amount_to', 'applied_rate', 'source', 'note'
        ]


class PurchaseUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления закупки"""
    
    class Meta:
        model = Purchase
        fields = [
            'amount_from', 'amount_to', 'applied_rate', 'source', 'note'
        ]
