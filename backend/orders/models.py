from decimal import Decimal
from django.core.validators import MinValueValidator, RegexValidator
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model
from exchange.models import Branch, Currency

User = get_user_model()


class Order(models.Model):
    """Модель для хранения заказов на обмен валюты"""
    STATUS_CHOICES = [
        ('NEW', 'Принят в обработку'),
        ('PROCESSING', 'Заказ собирается'),
        ('DELIVERY', 'Доставка'),
        ('COMPLETED', 'Выполнен'),
        ('CANCELLED', 'Отменен'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders',
        null=True,  # Для незарегистрированных пользователей
        verbose_name='Пользователь'
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name='Филиал'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='NEW',
        verbose_name='Статус'
    )
    client_email = models.EmailField(verbose_name='Email клиента')
    client_phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='Телефон клиента'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Создан'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Обновлен'
    )
    operator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_orders',
        verbose_name='Оператор'
    )
    total_from_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0'),
        verbose_name='Общая сумма исходной валюты'
    )
    total_to_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0'),
        verbose_name='Общая сумма целевой валюты'
    )
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in format: '+999999999'"
    )
    client_phone = models.CharField(
        max_length=20,
        validators=[phone_regex],
        blank=True,
        null=True,
        verbose_name='Телефон клиента'
    )

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']

    def __str__(self):
        return f"Заказ #{self.id} ({self.get_status_display()})"

    def calculate_totals(self):
        """Подсчет общих сумм заказа"""
        self.total_from_amount = sum(
            item.from_amount for item in self.items.all()
        )
        self.total_to_amount = sum(
            item.to_amount for item in self.items.all()
        )


class OrderItem(models.Model):
    """Модель для хранения отдельных операций обмена в заказе"""
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Заказ'
    )
    from_currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name='from_order_items',
        verbose_name='Исходная валюта'
    )
    to_currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name='to_order_items',
        verbose_name='Целевая валюта'
    )
    from_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name='Сумма исходной валюты'
    )
    to_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name='Сумма целевой валюты'
    )
    rate = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        validators=[MinValueValidator(Decimal('0.000001'))],
        verbose_name='Курс обмена'
    )

    class Meta:
        verbose_name = 'Элемент заказа'
        verbose_name_plural = 'Элементы заказа'

    def clean(self):
        if self.from_currency == self.to_currency:
            raise ValidationError("Валюты обмена должны различаться")

    def __str__(self):
        return f"{self.from_amount} {self.from_currency} -> {self.to_amount} {self.to_currency}"


class Review(models.Model):
    """Модель для хранения отзывов к заказам"""
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='review',
        verbose_name='Заказ'
    )
    text = models.TextField(verbose_name='Текст отзыва')
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Создан'
    )

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']

    def __str__(self):
        return f"Отзыв к заказу #{self.order.id}"
