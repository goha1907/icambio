from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User
from orders.models import Order


class Review(models.Model):
    """Модель отзыва согласно схеме БД."""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Пользователь',
        related_name='reviews'
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        verbose_name='Заказ',
        related_name='reviews'
    )
    
    rating = models.IntegerField(
        'Оценка',
        validators=[
            MinValueValidator(1, message="Оценка не может быть меньше 1"),
            MaxValueValidator(5, message="Оценка не может быть больше 5")
        ]
    )
    comment = models.TextField('Комментарий', blank=True)
    visible = models.BooleanField('Видимый', default=False)
    
    created_at = models.DateTimeField('Создан', auto_now_add=True)

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        db_table = 'reviews'
        unique_together = ['user', 'order']
        ordering = ['-created_at']

    def __str__(self):
        return f"Отзыв {self.user.email} к заказу {self.order.id[:8]}"

    @property
    def user_name(self):
        """Имя пользователя для отображения"""
        return self.user.full_name

    @property
    def order_summary(self):
        """Краткое описание заказа"""
        return (
            f"{self.order.amount_from} {self.order.currency_from.code} -> "
            f"{self.order.amount_to} {self.order.currency_to.code}"
        )
