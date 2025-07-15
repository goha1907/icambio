from rest_framework import serializers
from branches.models import Branch, BranchHours, BranchCurrency
from core.models import Address
from exchange.models import Currency


class AddressSerializer(serializers.ModelSerializer):
    """Сериализатор для адреса."""
    
    class Meta:
        model = Address
        fields = [
            'id', 'country', 'city', 'street', 'house_number',
            'postal_code', 'full_address', 'latitude', 'longitude'
        ]


class BranchHoursSerializer(serializers.ModelSerializer):
    """Сериализатор для графика работы филиала."""
    
    weekday_display = serializers.CharField(
        source='get_weekday_display', 
        read_only=True
    )
    
    class Meta:
        model = BranchHours
        fields = [
            'id', 'weekday', 'weekday_display', 'is_open',
            'open_time', 'close_time'
        ]


class CurrencySerializer(serializers.ModelSerializer):
    """Сериализатор для валюты."""
    
    class Meta:
        model = Currency
        fields = ['id', 'code', 'name', 'symbol', 'decimal_places']


class BranchCurrencySerializer(serializers.ModelSerializer):
    """Сериализатор для валют филиала."""
    
    currency = CurrencySerializer(read_only=True)
    
    class Meta:
        model = BranchCurrency
        fields = ['id', 'currency', 'amount']


class BranchSerializer(serializers.ModelSerializer):
    """Сериализатор для филиала."""
    
    address = AddressSerializer(read_only=True)
    hours = BranchHoursSerializer(many=True, read_only=True)
    currencies = BranchCurrencySerializer(many=True, read_only=True)
    
    class Meta:
        model = Branch
        fields = [
            'id', 'name', 'email', 'whatsapp', 'telegram', 'instagram',
            'address', 'is_active', 'created_at', 'hours', 'currencies'
        ]
        read_only_fields = ['created_at']


class BranchListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка филиалов."""
    
    address = AddressSerializer(read_only=True)
    
    class Meta:
        model = Branch
        fields = [
            'id', 'name', 'email', 'whatsapp', 'telegram',
            'address', 'is_active'
        ] 