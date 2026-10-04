import uuid
import random
import string
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from core.models import Address
from django.conf import settings


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email обязателен')

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)
    
    def create_user_with_code(self, email, password=None, **extra_fields):
        """Создает пользователя с гарантированно уникальным кодом."""
        from django.db import IntegrityError
        
        for _ in range(10):
            extra_fields['referral_code'] = self.generate_unique_referral_code()
            try:
                return self.create_user(
                    email=email, password=password, **extra_fields
                )
            except IntegrityError:
                continue
        raise Exception(
            "Не удалось создать пользователя с уникальным кодом"
        )

    def generate_referral_code(length=8):
        """Генерирует случайный реферальный код заданной длины."""
        characters = string.ascii_uppercase + string.digits
        return ''.join(random.choices(characters, k=length))

    def generate_unique_referral_code(self):
        """Генерирует уникальный реферальный код с проверкой в БД."""
        max_attempts = 10  # Ограничиваем количество попыток
        
        for attempt in range(max_attempts):
            # Генерируем код на основе UUID для высокой энтропии
            code = uuid.uuid4().hex[:8].upper()
            
            # Проверяем уникальность в БД
            if not self.get_queryset().filter(
                referral_code=code
            ).exists():
                return code
        
        # Если UUID не помог, используем случайную генерацию
        for attempt in range(max_attempts):
            code = self.generate_referral_code()
            if not self.get_queryset().filter(
                referral_code=code
            ).exists():
                return code
        
        # Если и это не помогло, добавляем timestamp
        import time
        timestamp = str(int(time.time()))[-4:]
        code = f"{uuid.uuid4().hex[:4].upper()}{timestamp}"
        
        return code


class User(AbstractUser):
    """Модель пользователя согласно схеме БД."""
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    username = models.CharField(
        'Username',
        max_length=150,
        blank=True,
        null=True
    )
    email = models.EmailField('Email', unique=True, blank=False)
    first_name = models.CharField('Имя', max_length=150, blank=True)
    last_name = models.CharField('Фамилия', max_length=150, blank=True)
    
    whatsapp = models.BigIntegerField('WhatsApp', null=True, blank=True)
    telegram = models.CharField(
        'Telegram',
        max_length=100,
        null=True,
        blank=True
    )
    
    address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        verbose_name='Адрес',
        null=True,
        blank=True,
        related_name='users'
    )
    
    referral_code = models.CharField(
        max_length=20,
        unique=True,
        blank=False,
        null=False,
        verbose_name='Реферальный код',
        default='',
        help_text='Уникальный реферальный код пользователя'
    )
    referred_by_code = models.CharField(
        'Код реферера',
        max_length=20,
        blank=True,
        null=True
    )
    
    referral_amount = models.DecimalField(
        'Накопления за рефералов',
        max_digits=15,
        decimal_places=4,
        default=0
    )
    
    role = models.CharField(
        'Роль',
        max_length=20,
        default='user',
        choices=[
            ('user', 'Пользователь'),
            ('operator', 'Оператор'),
            ('admin', 'Администратор'),
            ('owner', 'Владелец'),
        ]
    )
    
    created_at = models.DateTimeField('Создан', auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        db_table = 'users'

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = self.generate_referral_code()
        super().save(*args, **kwargs)

    def generate_referral_code(self):
        import uuid
        return uuid.uuid4().hex[:10]

    @property
    def referral_link(self):
        """Генерация реферальной ссылки"""
        base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        return f"{base_url}/register?ref={self.referral_code}"

    @property
    def full_name(self):
        """Полное имя пользователя"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.username:
            return self.username
        else:
            return self.email


class ReferralTransaction(models.Model):
    """Модель начислений и выплат по реферальной программе."""
    
    TYPE_CHOICES = [
        ('earn', 'Начисление'),
        ('withdrawal', 'Выплата'),
        ('adjustment', 'Корректировка'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь',
        related_name='referral_transactions'
    )
    referred_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        verbose_name='Реферал',
        null=True,
        blank=True,
        related_name='referred_transactions'
    )
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        verbose_name='Заказ',
        null=True,
        blank=True,
        related_name='referral_transactions'
    )
    
    type = models.CharField(
        'Тип операции',
        max_length=20,
        choices=TYPE_CHOICES
    )
    amount = models.DecimalField(
        'Сумма',
        max_digits=15,
        decimal_places=4
    )
    currency = models.ForeignKey(
        'exchange.Currency',
        on_delete=models.CASCADE,
        verbose_name='Валюта'
    )
    branch = models.ForeignKey(
        'branches.Branch',
        on_delete=models.SET_NULL,
        verbose_name='Филиал',
        null=True,
        blank=True
    )
    note = models.TextField('Примечание', blank=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Реферальная транзакция'
        verbose_name_plural = 'Реферальные транзакции'
        db_table = 'referral_transactions'
        indexes = [
            models.Index(fields=['user', 'order']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return (
            f"{self.get_type_display()} {self.amount} "
            f"{self.currency.code} для {self.user.email}"
        )
