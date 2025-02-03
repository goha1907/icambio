from rest_framework import serializers
from exchange.models import (
    Currency,
    ExchangeRate,
    ExchangeOffice,
    CurrencyBalance
)


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['id', 'code', 'name', 'symbol', 'is_active']


class ExchangeRateSerializer(serializers.ModelSerializer):
    from_currency_code = serializers.CharField(
        source='from_currency.code', read_only=True
    )
    to_currency_code = serializers.CharField(
        source='to_currency.code', read_only=True
    )

    class Meta:
        model = ExchangeRate
        fields = ['id', 'from_currency', 'to_currency',
                  'from_currency_code', 'to_currency_code',
                  'rate', 'min_amount', 'is_active', 'updated_at']

    def validate(self, data):
        """Проверка валютной пары"""
        if data.get('from_currency') == data.get('to_currency'):
            raise serializers.ValidationError("Валюты должны быть разными")
        return data


class ExchangeOfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeOffice
        fields = ['id', 'name', 'address',
                  'latitude', 'longitude', 'is_active']


class CurrencyBalanceSerializer(serializers.ModelSerializer):
    currency_code = serializers.CharField(
        source='currency.code', read_only=True
    )
    currency_name = serializers.CharField(
        source='currency.name', read_only=True
    )

    class Meta:
        model = CurrencyBalance
        fields = ['id', 'office', 'currency', 'currency_code',
                  'currency_name', 'balance']
