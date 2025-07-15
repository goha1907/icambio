from django.db import models


class Address(models.Model):
    """Модель адреса согласно схеме БД."""
    
    country = models.CharField('Страна', max_length=100, blank=True)
    city = models.CharField('Город', max_length=100, blank=True)
    street = models.CharField('Улица', max_length=200, blank=True)
    house_number = models.CharField('Номер дома', max_length=20, blank=True)
    postal_code = models.CharField('Почтовый индекс', max_length=20, blank=True)
    
    full_address = models.TextField(
        'Полный адрес',
        blank=True
    )
    latitude = models.DecimalField(
        'Широта',
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    longitude = models.DecimalField(
        'Долгота',
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    
    created_at = models.DateTimeField('Создан', auto_now_add=True)

    class Meta:
        verbose_name = 'Адрес'
        verbose_name_plural = 'Адреса'
        db_table = 'addresses'

    def __str__(self):
        return self.full_address

    def save(self, *args, **kwargs):
        # Автоматически формируем полный адрес, если он не задан
        if not self.full_address:
            parts = []
            if self.street and self.house_number:
                parts.append(f"{self.street}, {self.house_number}")
            elif self.street:
                parts.append(self.street)
            
            if self.city:
                parts.append(self.city)
            
            if self.country:
                parts.append(self.country)
            
            if self.postal_code:
                parts.append(self.postal_code)
            
            self.full_address = (
                ', '.join(parts) if parts else 'Адрес не указан'
            )
        
        super().save(*args, **kwargs)


class CurrencyMovement(models.Model):
    """Модель журнала всех валютных движений в кассе."""
    
    TYPE_CHOICES = [
        ('deposit', 'Пополнение'),
        ('withdrawal', 'Списание'),
        ('correction', 'Корректировка'),
    ]
    
    branch = models.ForeignKey(
        'branches.Branch',
        on_delete=models.CASCADE,
        verbose_name='Филиал',
        related_name='currency_movements'
    )
    currency = models.ForeignKey(
        'exchange.Currency',
        on_delete=models.CASCADE,
        verbose_name='Валюта'
    )
    user = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        verbose_name='Пользователь',
        null=True,
        blank=True
    )
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        verbose_name='Заказ',
        null=True,
        blank=True
    )
    purchase = models.ForeignKey(
        'exchange.Purchase',
        on_delete=models.SET_NULL,
        verbose_name='Закупка',
        null=True,
        blank=True
    )
    referral_transaction = models.ForeignKey(
        'users.ReferralTransaction',
        on_delete=models.SET_NULL,
        verbose_name='Реферальная транзакция',
        null=True,
        blank=True
    )
    
    type = models.CharField(
        'Тип движения',
        max_length=20,
        choices=TYPE_CHOICES
    )
    amount = models.DecimalField(
        'Сумма',
        max_digits=15,
        decimal_places=4
    )
    reason = models.TextField('Причина', blank=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Движение валюты'
        verbose_name_plural = 'Движения валют'
        db_table = 'currency_movements'
        indexes = [
            models.Index(fields=['branch', 'currency', 'user']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return (
            f"{self.get_type_display()} {self.amount} "
            f"{self.currency.code} в {self.branch.name}"
        )
