from rest_framework import serializers
from .models import Currency, Branch, ExchangeRate, CurrencyBalance


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'


class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = '__all__'


class CurrencyBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencyBalance
        fields = '__all__'


class ExchangeCalculatorSerializer(serializers.Serializer):
    from_currency = serializers.CharField(max_length=3)
    to_currency = serializers.CharField(max_length=3)
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0)
    branch_id = serializers.IntegerField()
