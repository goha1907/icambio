from django.db import models
from branches.models import Branch


class Currency(models.Model):
    """Модель валюты согласно схеме БД."""
    
    code = models.CharField('Код валюты', max_length=10, unique=True, blank=False)
    name = models.CharField('Название', max_length=50, unique=True, blank=False)
    symbol = models.CharField('Символ', max_length=5, blank=True)
    decimal_places = models.PositiveSmallIntegerField(
        'Знаков после запятой',
        default=2
    )
    created_at = models.DateTimeField('Создана', auto_now_add=True)

    class Meta:
        verbose_name = 'Валюта'
        verbose_name_plural = 'Валюты'
        db_table = 'currencies'

    def __str__(self):
        return f"{self.code} - {self.name}"


class ExchangeRate(models.Model):
    """Модель курса обмена согласно схеме БД."""
    
    currency_from = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        verbose_name='Из валюты',
        related_name='rates_from'
    )
    currency_to = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        verbose_name='В валюту',
        related_name='rates_to'
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        verbose_name='Филиал',
        related_name='exchange_rates'
    )
    
    min_amount = models.DecimalField(
        'Минимальная сумма',
        max_digits=15,
        decimal_places=4,
        blank=False
    )
    max_amount = models.DecimalField(
        'Максимальная сумма',
        max_digits=15,
        decimal_places=4,
        null=True,
        blank=True
    )
    rate = models.DecimalField(
        'Курс',
        max_digits=15,
        decimal_places=8,
        blank=False
    )
    
    is_hot = models.BooleanField('Горячий курс', default=False)
    visible = models.BooleanField('Видимый', default=False)
    in_filter = models.BooleanField('В фильтрах', default=False)
    
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Курс обмена'
        verbose_name_plural = 'Курсы обмена'
        db_table = 'exchange_rates'
        unique_together = [
            'currency_from',
            'currency_to',
            'branch',
            'min_amount'
        ]

    def __str__(self):
        return (
            f"{self.currency_from.code} -> {self.currency_to.code} "
            f"({self.branch.name}): {self.rate}"
        )

    def calculate_to_receive(self, amount_from):
        """Расчет суммы к получению"""
        if amount_from < self.min_amount:
            raise ValueError(
                f"Сумма обмена должна быть не менее {self.min_amount}"
            )
        if self.max_amount and amount_from > self.max_amount:
            raise ValueError(
                f"Сумма обмена должна быть не более {self.max_amount}"
            )
        return amount_from * self.rate

    def calculate_to_exchange(self, amount_to):
        """Расчет суммы к обмену"""
        amount_from = amount_to / self.rate
        if amount_from < self.min_amount:
            raise ValueError(
                f"Сумма обмена будет меньше минимальной {self.min_amount}"
            )
        if self.max_amount and amount_from > self.max_amount:
            raise ValueError(
                f"Сумма обмена будет больше максимальной {self.max_amount}"
            )
        return amount_from


class Purchase(models.Model):
    """Модель закупок валют у оптовиков."""
    
    branch = models.ForeignKey(
        'branches.Branch',
        on_delete=models.CASCADE,
        verbose_name='Филиал',
        related_name='purchases'
    )
    currency_from = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        verbose_name='Чем заплатили',
        related_name='purchases_from'
    )
    currency_to = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        verbose_name='Что купили',
        related_name='purchases_to'
    )
    
    amount_from = models.DecimalField(
        'Сумма к оплате',
        max_digits=15,
        decimal_places=4
    )
    amount_to = models.DecimalField(
        'Сумма к получению',
        max_digits=15,
        decimal_places=4
    )
    applied_rate = models.DecimalField(
        'Примененный курс',
        max_digits=15,
        decimal_places=8
    )
    
    source = models.CharField('Источник', max_length=100, blank=True)
    user = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        verbose_name='Пользователь',
        null=True,
        blank=True
    )
    note = models.TextField('Примечание', blank=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Закупка валюты'
        verbose_name_plural = 'Закупки валют'
        db_table = 'purchases'
        indexes = [
            models.Index(fields=['branch', 'currency_to']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return (
            f"Закупка {self.amount_to} {self.currency_to.code} "
            f"за {self.amount_from} {self.currency_from.code}"
        )
