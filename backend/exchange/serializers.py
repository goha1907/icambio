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

    def validate_working_hours(self, value):
        """Валидация формата рабочих часов"""
        required_days = ['monday', 'tuesday', 'wednesday',
                         'thursday', 'friday', 'saturday', 'sunday']

        if not isinstance(value, dict):
            raise serializers.ValidationError("Working hours must be a dictionary")

        for day in required_days:
            if day not in value:
                raise serializers.ValidationError(f"Missing {day} in working hours")
            if not isinstance(value[day], dict):
                raise serializers.ValidationError(f"Invalid format for {day}")
            if 'open' not in value[day] or 'close' not in value[day]:
                raise serializers.ValidationError(f"Missing open/close time for {day}")

        return value
