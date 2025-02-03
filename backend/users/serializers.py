from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserCreateSerializer(BaseUserCreateSerializer):
    referral_code = serializers.CharField(required=False, write_only=True)

    class Meta(BaseUserCreateSerializer.Meta):
        fields = ('username', 'email', 'password', 'referral_code')

    def validate_referral_code(self, value):
        if value:
            try:
                User.objects.get(referral_code=value)
            except User.DoesNotExist:
                raise serializers.ValidationError("Неверный реферальный код")
        return value

    def create(self, validated_data):
        referral_code = validated_data.pop('referral_code', None)
        user = super().create(validated_data)

        if referral_code:
            referrer = User.objects.get(referral_code=referral_code)
            user.referred_by = referrer
            user.save()

        return user


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'phone', 'telegram', 'whatsapp')

    def validate_phone(self, value):
        if value and not value.startswith('+'):
            raise serializers.ValidationError(
                "Номер телефона должен начинаться с '+'"
            )
        return value


class UserSerializer(BaseUserSerializer):
    referral_link = serializers.CharField(read_only=True)

    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'phone', 'telegram', 'whatsapp', 'referral_link')
        read_only_fields = ('referral_code', 'bonus_balance')
