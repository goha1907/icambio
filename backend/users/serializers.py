from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('email', 'password', 're_password')

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
        fields = ('username', 'first_name', 'last_name', 'telegram', 'whatsapp')

    def validate_username(self, value):
        if User.objects.exclude(pk=self.instance.pk).filter(username=value).exists():
            raise serializers.ValidationError("Этот никнейм уже занят")
        return value


class UserSerializer(BaseUserSerializer):
    referral_link = serializers.CharField(read_only=True)

    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'telegram', 'whatsapp', 'referral_link')
        read_only_fields = ('email', 'referral_code', 'bonus_balance')
