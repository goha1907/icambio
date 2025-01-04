import base64
from django.core.files.base import ContentFile
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
import uuid

User = get_user_model()


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = (
            'username',
            'password',
            'password2',
            'email',
            'first_name',
            'last_name'
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Этот email уже используется.")
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            referral_code=str(uuid.uuid4())[:8],
            **validated_data
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)
    avatar_base64 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'telegram',
            'phone',
            'avatar',
            'avatar_base64',
            'referral_code',
            'referral_balance'
        )
        read_only_fields = (
            'referral_code',
            'referral_balance'
        )

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("Этот email уже используется.")
        return value

    def validate_avatar_base64(self, value):
        if value:
            try:
                format, imgstr = value.split(';base64,')
                ext = format.split('/')[-1]
                return ContentFile(
                    base64.b64decode(imgstr),
                    name=f'avatar.{ext}'
                )
            except Exception:
                raise serializers.ValidationError(
                    "Неверный формат изображения"
                )
        return None


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password]
    )
