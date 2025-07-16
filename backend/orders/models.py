from django.db import models
from django.core.validators import MinValueValidator
from users.models import User
from branches.models import Branch
from exchange.models import Currency
from core.models import Address


class Order(models.Model):
    """Модель заказа согласно схеме БД."""
    
    STATUS_CHOICES = [
        ('pending', 'Ожидает обработки'),
        ('completed', 'Выполнен'),
        ('canceled', 'Отменён'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь',
        related_name='orders'
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        verbose_name='Филиал',
        related_name='orders'
    )
    
    currency_from = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        verbose_name='Из валюты',
        related_name='orders_from'
    )
    currency_to = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        verbose_name='В валюту',
        related_name='orders_to'
    )
    
    amount_from = models.DecimalField(
        'Сумма к обмену',
        max_digits=15,
        decimal_places=4,
        validators=[MinValueValidator('0.0001')]
    )
    amount_to = models.DecimalField(
        'Сумма к получению',
        max_digits=15,
        decimal_places=4,
        validators=[MinValueValidator('0.0001')]
    )
    applied_rate = models.DecimalField(
        'Примененный курс',
        max_digits=15,
        decimal_places=8
    )
    
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    delivery = models.BooleanField('Доставка', default=False)
    delivery_address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        verbose_name='Адрес доставки',
        null=True,
        blank=True,
        related_name='delivery_orders'
    )
    
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    completed_at = models.DateTimeField('Завершен', null=True, blank=True)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        db_table = 'orders'
        ordering = ['-created_at']

    def __str__(self):
        return (
            f"Заказ {self.id} - "
            f"{self.amount_from} {self.currency_from.code} -> "
            f"{self.amount_to} {self.currency_to.code}"
        )

    def save(self, *args, **kwargs):
        # Автоматически устанавливаем время завершения при изменении статуса
        if self.status == 'completed' and not self.completed_at:
            from django.utils import timezone
            self.completed_at = timezone.now()
        super().save(*args, **kwargs)

    @property
    def is_completed(self):
        """Проверяет, завершен ли заказ"""
        return self.status == 'completed'

    @property
    def is_canceled(self):
        """Проверяет, отменен ли заказ"""
        return self.status == 'canceled'

    @property
    def is_pending(self):
        """Проверяет, ожидает ли заказ обработки"""
        return self.status == 'pending'


class OrderProfit(models.Model):
    """Модель фиксации прибыли по ордерам согласно схеме БД."""
    
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        verbose_name='Заказ',
        related_name='profits'
    )
    currency = models.ForeignKey(
        'exchange.Currency',
        on_delete=models.CASCADE,
        verbose_name='Валюта прибыли'
    )
    amount = models.DecimalField(
        'Сумма прибыли',
        max_digits=15,
        decimal_places=4
    )
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Прибыль по заказу'
        verbose_name_plural = 'Прибыли по заказам'
        db_table = 'order_profit'
        ordering = ['-created_at']

    def __str__(self):
        return (
            f"Прибыль по заказу {self.order.id}: "
            f"{self.amount} {self.currency.code}"
        )
