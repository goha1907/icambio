import uuid
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
    telegram = models.CharField('Telegram', max_length=100, blank=True)
    
    address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        verbose_name='Адрес',
        null=True,
        blank=True,
        related_name='users'
    )
    
    referral_code = models.CharField(
        'Реферальный код',
        max_length=20,
        unique=True,
        blank=False
    )
    referred_by_code = models.CharField(
        'Код реферера',
        max_length=20,
        blank=True,
        null=True
    )
    
    role = models.CharField(
        'Роль',
        max_length=20,
        default='user',
        choices=[
            ('user', 'Пользователь'),
            ('admin', 'Администратор'),
            ('operator', 'Оператор'),
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
            # Генерируем уникальный реферальный код
            import secrets
            import string
            alphabet = string.ascii_uppercase + string.digits
            while True:
                code = ''.join(secrets.choice(alphabet) for _ in range(8))
                if not User.objects.filter(referral_code=code).exists():
                    self.referral_code = code
                    break
        super().save(*args, **kwargs)

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
