from django.db import models
from core.models import Address


class Branch(models.Model):
    """Модель филиала согласно схеме БД."""
    
    name = models.CharField('Название', max_length=200, blank=False)
    email = models.EmailField('Email', unique=True, blank=True)
    whatsapp = models.BigIntegerField('WhatsApp', null=True, blank=True)
    telegram = models.CharField('Telegram', max_length=100, blank=True)
    instagram = models.CharField('Instagram', max_length=100, blank=True)
    
    address = models.ForeignKey(
        Address,
        on_delete=models.CASCADE,
        verbose_name='Адрес филиала',
        related_name='branches'
    )
    
    is_active = models.BooleanField('Активен', default=True)
    created_at = models.DateTimeField('Создан', auto_now_add=True)

    class Meta:
        verbose_name = 'Филиал'
        verbose_name_plural = 'Филиалы'
        db_table = 'branches'

    def __str__(self):
        return self.name


class BranchHours(models.Model):
    """Модель графика работы филиала согласно схеме БД."""
    
    WEEKDAY_CHOICES = [
        (0, 'Воскресенье'),
        (1, 'Понедельник'),
        (2, 'Вторник'),
        (3, 'Среда'),
        (4, 'Четверг'),
        (5, 'Пятница'),
        (6, 'Суббота'),
    ]
    
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        verbose_name='Филиал',
        related_name='hours'
    )
    weekday = models.IntegerField(
        'День недели',
        choices=WEEKDAY_CHOICES,
        blank=False
    )
    open_time = models.TimeField('Время открытия', null=True, blank=True)
    close_time = models.TimeField('Время закрытия', null=True, blank=True)
    is_open = models.BooleanField('Открыт', default=True)

    class Meta:
        verbose_name = 'График работы филиала'
        verbose_name_plural = 'Графики работы филиалов'
        db_table = 'branch_hours'
        unique_together = ['branch', 'weekday']

    def __str__(self):
        weekday_name = dict(self.WEEKDAY_CHOICES)[self.weekday]
        if self.is_open and self.open_time and self.close_time:
            return (
            f"{self.branch.name} - {weekday_name}: "
            f"{self.open_time}-{self.close_time}"
        )
        elif self.is_open:
            return f"{self.branch.name} - {weekday_name}: открыт"
        else:
            return f"{self.branch.name} - {weekday_name}: закрыт"


class BranchCurrency(models.Model):
    """Модель валют филиала согласно схеме БД."""
    
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        verbose_name='Филиал',
        related_name='currencies'
    )
    currency = models.ForeignKey(
        'exchange.Currency',
        on_delete=models.CASCADE,
        verbose_name='Валюта'
    )
    amount = models.DecimalField(
        'Количество',
        max_digits=15,
        decimal_places=4,
        default=0
    )

    class Meta:
        verbose_name = 'Валюта филиала'
        verbose_name_plural = 'Валюты филиалов'
        db_table = 'branch_currencies'
        unique_together = ['branch', 'currency']

    def __str__(self):
        return f"{self.branch.name} - {self.currency.code}: {self.amount}"
