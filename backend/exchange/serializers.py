from rest_framework import serializers
from .models import Currency, ExchangeRate, Purchase


class CurrencySerializer(serializers.ModelSerializer):
    """Сериализатор для модели Currency"""
    
    class Meta:
        model = Currency
        fields = ['id', 'code', 'name', 'symbol', 'is_active']


class CurrencyCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания валюты"""
    
    class Meta:
        model = Currency
        fields = ['code', 'name', 'symbol', 'is_active']


class CurrencyUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления валюты"""
    
    class Meta:
        model = Currency
        fields = ['name', 'symbol', 'is_active']


class ExchangeRateSerializer(serializers.ModelSerializer):
    """Сериализатор для модели ExchangeRate"""
    from_currency_code = serializers.CharField(source='from_currency.code', read_only=True)
    to_currency_code = serializers.CharField(source='to_currency.code', read_only=True)
    
    class Meta:
        model = ExchangeRate
        fields = [
            'id', 'from_currency', 'to_currency', 'rate', 'visible',
            'created_at', 'updated_at', 'from_currency_code', 'to_currency_code'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExchangeRateCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания курса обмена"""
    
    class Meta:
        model = ExchangeRate
        fields = ['from_currency', 'to_currency', 'rate', 'visible']


class ExchangeRateUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления курса обмена"""
    
    class Meta:
        model = ExchangeRate
        fields = ['rate', 'visible']


class PurchaseSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Purchase"""
    currency_code = serializers.CharField(source='currency.code', read_only=True)
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    
    class Meta:
        model = Purchase
        fields = [
            'id', 'branch', 'currency', 'amount', 'rate', 'total_cost',
            'purchase_date', 'notes', 'currency_code', 'branch_name'
        ]
        read_only_fields = ['id', 'purchase_date']


class PurchaseCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания закупки"""
    
    class Meta:
        model = Purchase
        fields = ['branch', 'currency', 'amount', 'rate', 'total_cost', 'notes']


class PurchaseUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления закупки"""
    
    class Meta:
        model = Purchase
        fields = ['amount', 'rate', 'total_cost', 'notes']
