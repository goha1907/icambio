from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Order(models.Model):
    """Модель заказа на обмен валюты."""
    STATUS_CHOICES = [
        ('new', 'Новый'),
        ('processing', 'В обработке'),
        ('waiting_delivery', 'Ожидает выдачу'),
        ('completed', 'Выполнен'),
        ('cancelled', 'Отменён'),
    ]

    user = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name='Пользователь'
    )
    office = models.ForeignKey(
        'exchange.ExchangeOffice',
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name='Обменный пункт'
    )
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=STATUS_CHOICES,
        default='new'
    )
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлён', auto_now=True)
    delivery_address = models.TextField(
        'Адрес доставки',
        blank=True,
        null=True
    )
    comment = models.TextField('Комментарий', blank=True)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return f"Заказ #{self.id} ({self.status})"


class OrderItem(models.Model):
    """Модель элемента заказа (конкретной операции обмена)."""
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Заказ'
    )
    from_currency = models.ForeignKey(
        'exchange.Currency',
        related_name='exchanges_from',
        on_delete=models.PROTECT,
        verbose_name='Из валюты'
    )
    to_currency = models.ForeignKey(
        'exchange.Currency',
        related_name='exchanges_to',
        on_delete=models.PROTECT,
        verbose_name='В валюту'
    )
    amount_from = models.DecimalField(
        'Сумма обмена',
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    amount_to = models.DecimalField(
        'Сумма к получению',
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    rate = models.DecimalField(
        'Курс обмена',
        max_digits=10,
        decimal_places=4
    )

    class Meta:
        verbose_name = 'Элемент заказа'
        verbose_name_plural = 'Элементы заказа'

    def __str__(self):
        return f"{self.amount_from} {self.from_currency.code} -> {self.amount_to} {self.to_currency.code}"


class Review(models.Model):
    """Модель отзыва."""
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='review',
        verbose_name='Заказ'
    )
    rating = models.PositiveSmallIntegerField(
        'Оценка',
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5
    )
    text = models.TextField('Текст отзыва')
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    is_published = models.BooleanField('Опубликован', default=False)

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'

    def __str__(self):
        return f"Отзыв к заказу #{self.order.id}"
