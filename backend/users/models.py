import shortuuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator

from django.conf import settings


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Email обязателен')
        if not username:
            raise ValueError('Username обязателен')

        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, username, password, **extra_fields)


class User(AbstractUser):
    """Модель пользователя с дополнительными полями."""
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message=(
            "Номер телефона должен быть в формате: '+999999999'. До 15 цифр."
        )
    )
    username = models.CharField('Username', max_length=150, unique=True)
    email = models.EmailField('Email', unique=True)
    phone = models.CharField(
        'Телефон',
        validators=[phone_regex],
        max_length=17,
        blank=True
    )
    telegram = models.URLField('Telegram', blank=True)
    whatsapp = models.URLField('WhatsApp', blank=True)
    referral_code = models.CharField(
        'Реферальный код',
        max_length=10,
        unique=True,
        blank=True,
        editable=False
    )
    referred_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='referrals',
        verbose_name='Реферер'
    )
    bonus_balance = models.DecimalField(
        'Бонусный баланс',
        max_digits=10,
        decimal_places=2,
        default=0
    )

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = shortuuid.uuid()[:10].upper()
        super().save(*args, **kwargs)

    @property
    def referral_link(self):
        """Генерация реферальной ссылки"""
        base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        return f"{base_url}/register?ref={self.referral_code}"
