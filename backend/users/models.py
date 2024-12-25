from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, RegexValidator
from decimal import Decimal


class User(AbstractUser):
    phone_regex = RegexValidator(
        regex=r'^\+[1-9]\d{0,2}\d{10}$',
        message="Номер телефона должен быть в формате: '+1239990000000'"
    )
    email = models.EmailField(
        max_length=254,
        unique=True,
        verbose_name='Email address'
    )
    telegram = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Telegram link'
    )
    phone = models.CharField(
        max_length=20,
        validators=[phone_regex],
        blank=True,
        null=True,
        verbose_name='Phone number'
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        verbose_name='Avatar'
    )
    referral_code = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True,
        verbose_name='Referral code'
    )
    referral_balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0'),
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name='Referral balance'
    )

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username
