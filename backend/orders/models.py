import shortuuid
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
    FileExtensionValidator
)
from django.db.models import Sum


class Order(models.Model):
    """Модель заказа на обмен валюты."""
    STATUS_CHOICES = [
        ('new', 'Новый'),
        ('processing', 'В обработке'),
        ('waiting_delivery', 'Ожидает выдачу'),
        ('completed', 'Выполнен'),
        ('cancelled', 'Отменён'),
    ]
    STATUS_FLOW = {
        'new': ['processing', 'cancelled'],
        'processing': ['waiting_delivery', 'cancelled'],
        'waiting_delivery': ['completed', 'cancelled'],
        'completed': [],  # Конечный статус
        'cancelled': [],  # Конечный статус
    }

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
    tracking_code = models.CharField(
        'Код отслеживания',
        max_length=10,
        unique=True,
        blank=True
    )
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=STATUS_CHOICES,
        default='new'
    )
    whatsapp = models.CharField('WhatsApp', max_length=20, blank=True)
    telegram = models.CharField('Telegram', max_length=50, blank=True)
    needs_delivery = models.BooleanField('Требуется доставка', default=False)
    delivery_address = models.TextField(
        'Адрес доставки',
        blank=True,
        null=True
    )
    comment = models.TextField('Комментарий', blank=True)
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлён', auto_now=True)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']

    def __str__(self):
        return f"Заказ #{self.id} ({self.get_status_display()})"

    def save(self, *args, **kwargs):
        if not self.tracking_code:
            self.tracking_code = shortuuid.uuid()[:10]
        super().save(*args, **kwargs)

    def can_transition_to(self, new_status):
        """Проверяет, возможен ли переход в новый статус"""
        return new_status in self.STATUS_FLOW[self.status]

    def can_complete(self):
        """Проверка возможности завершения заказа"""
        return (
            self.status == 'waiting_delivery' and
            self.documents.filter(document_type='receipt').exists() and
            self.documents.filter(document_type='chat').exists()
        )

    def set_status(self, new_status):
        """Изменяет статус с проверкой возможности перехода"""
        if new_status == 'completed' and not self.can_complete():
            raise ValidationError(
                'Для завершения заказа необходимо приложить '
                'квитанцию об оплате и скриншот чата'
            )

        if self.can_transition_to(new_status):
            self.status = new_status
            self.save()
            return True
        return False

    @property
    def total_from_amount(self):
        """Общая сумма к обмену"""
        return self.items.aggregate(
            total=Sum('amount_from')
        )['total'] or 0

    @property
    def total_to_amount(self):
        """Общая сумма к получению"""
        return self.items.aggregate(
            total=Sum('amount_to')
        )['total'] or 0


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
        max_digits=20,
        decimal_places=10,
        validators=[MinValueValidator('0.00000001')]
    )
    amount_to = models.DecimalField(
        'Сумма к получению',
        max_digits=20,
        decimal_places=10,
        validators=[MinValueValidator('0.00000001')]
    )
    rate = models.DecimalField(
        'Курс обмена',
        max_digits=20,
        decimal_places=10
    )

    class Meta:
        verbose_name = 'Элемент заказа'
        verbose_name_plural = 'Элементы заказа'

    def __str__(self):
        return (f"{self.amount_from} {self.from_currency.code} -> "
                f"{self.amount_to} {self.to_currency.code}")

    def get_formatted_amount_from(self):
        """Возвращает сумму с правильным количеством знаков после запятой"""
        return round(self.amount_from, self.from_currency.decimal_places)

    def get_formatted_amount_to(self):
        """Возвращает сумму с правильным количеством знаков после запятой"""
        return round(self.amount_to, self.to_currency.decimal_places)


def order_document_path(instance, filename):
    """Генерация пути для сохранения документов заказа"""
    return f'orders/{instance.order.id}/documents/{filename}'


class OrderDocument(models.Model):
    TYPE_CHOICES = [
        ('receipt', 'Квитанция об оплате'),
        ('chat', 'Скриншот чата'),
    ]

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name='Заказ'
    )
    document_type = models.CharField(
        'Тип документа',
        max_length=20,
        choices=TYPE_CHOICES
    )
    file = models.FileField(
        'Файл',
        upload_to=order_document_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'png', 'jpg', 'jpeg']
            )
        ]
    )
    uploaded_at = models.DateTimeField(
        'Время загрузки',
        auto_now_add=True
    )
    uploaded_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Кто загрузил'
    )

    class Meta:
        verbose_name = 'Документ заказа'
        verbose_name_plural = 'Документы заказа'
        unique_together = ['order', 'document_type']


class Review(models.Model):
    """Модель отзыва"""
    order = models.OneToOneField(
        'Order',
        on_delete=models.CASCADE,
        related_name='review',
        verbose_name='Заказ'
    )
    rating = models.PositiveSmallIntegerField(
        'Оценка',
        validators=[
            MinValueValidator(1, message="Оценка не может быть меньше 1"),
            MaxValueValidator(5, message="Оценка не может быть больше 5")
        ]
    )
    text = models.TextField('Текст отзыва')
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    is_visible = models.BooleanField(
        'Отображать на сайте',
        default=True
    )

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']

    def __str__(self):
        return f"Отзыв к заказу #{self.order.id}"

    @property
    def display_name(self):
        """Возвращает имя для отображения на сайте"""
        user = self.order.user
        if user.first_name:
            return user.first_name
        return user.username
