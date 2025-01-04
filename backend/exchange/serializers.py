import re
from datetime import datetime
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Currency, Branch, ExchangeRate, CurrencyBalance

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone')
        read_only_fields = ('id', 'username')


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

    def validate(self, data):
        """Проверка уникальности валютной пары для филиала"""
        if self.instance is None:
            exists = ExchangeRate.objects.filter(
                branch=data['branch'],
                from_currency=data['from_currency'],
                to_currency=data['to_currency']
            ).exists()
            if exists:
                raise serializers.ValidationError(
                    "Курс обмена для этой пары валют уже существует"
                )
        return data

    def validate_rate(self, value):
        """Проверка корректности курса обмена"""
        if value <= 0:
            raise serializers.ValidationError(
                "Курс обмена должен быть положительным числом"
            )
        return value


class CurrencyBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencyBalance
        fields = '__all__'


class ExchangeCalculatorSerializer(serializers.Serializer):
    from_currency = serializers.CharField(max_length=3)
    to_currency = serializers.CharField(max_length=3)
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0)
    branch_id = serializers.IntegerField()


class BranchDetailSerializer(serializers.ModelSerializer):
    """Подробный сериализатор для филиала"""
    exchange_rates = ExchangeRateSerializer(many=True, read_only=True)
    currency_balances = CurrencyBalanceSerializer(many=True, read_only=True)
    manager_details = UserSerializer(source='manager', read_only=True)

    class Meta:
        model = Branch
        fields = '__all__'


class BranchCreateUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания/обновления филиала"""
    working_hours = serializers.JSONField(required=False)

    class Meta:
        model = Branch
        fields = '__all__'

    def validate_email(self, value):
        if Branch.objects.exclude(pk=getattr(self.instance, 'pk', None)).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_working_hours(self, value):
        time_format = '%H:%M'
        for day, hours in value.items():
            try:
                open_time = datetime.strptime(hours['open'], time_format)
                close_time = datetime.strptime(hours['close'], time_format)
                if close_time <= open_time:
                    raise serializers.ValidationError(f"Closing time must be later than opening time for {day}")
            except ValueError:
                raise serializers.ValidationError(f"Invalid time format for {day}. Use HH:MM format")
        return value
