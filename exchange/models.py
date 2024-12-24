from django.db import models
from django.core.validators import MinValueValidator


class Currency(models.Model):
    """Модель для хранения информации о валютах"""
    code = models.CharField(max_length=3, unique=True, verbose_name='Код валюты')
    name = models.CharField(max_length=50, verbose_name='Название валюты')
    symbol = models.CharField(max_length=5, verbose_name='Символ валюты')

    class Meta:
        verbose_name = 'Валюта'
        verbose_name_plural = 'Валюты'
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"


class Branch(models.Model):
    """Модель для хранения информации о филиалах"""
    name = models.CharField(max_length=100, verbose_name='Название филиала')
    city = models.CharField(max_length=100, verbose_name='Город')
    address = models.TextField(verbose_name='Адрес')
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    email = models.EmailField(verbose_name='Email')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    base_currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name='base_branches',
        verbose_name='Базовая валюта'
    )

    class Meta:
        verbose_name = 'Филиал'
        verbose_name_plural = 'Филиалы'
        ordering = ['city', 'name']

    def __str__(self):
        return f"{self.city} - {self.name}"


class ExchangeRate(models.Model):
    """Модель для хранения курсов обмена валют"""
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name='exchange_rates',
        verbose_name='Филиал'
    )
    from_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name='from_rates',
        verbose_name='Исходная валюта'
    )
    to_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name='to_rates',
        verbose_name='Целевая валюта'
    )
    rate = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        validators=[MinValueValidator(0)],
        verbose_name='Курс обмена'
    )
    min_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=0,
        verbose_name='Минимальная сумма'
    )
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')

    class Meta:
        verbose_name = 'Курс обмена'
        verbose_name_plural = 'Курсы обмена'
        unique_together = ['branch', 'from_currency', 'to_currency']
        ordering = ['branch', 'from_currency', 'to_currency']

    def __str__(self):
        return f"{self.branch}: {self.from_currency} -> {self.to_currency} = {self.rate}"


class CurrencyBalance(models.Model):
    """Модель для хранения остатков валют в филиалах"""
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name='currency_balances',
        verbose_name='Филиал'
    )
    currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name='balances',
        verbose_name='Валюта'
    )
    amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='Сумма'
    )
    average_purchase_rate = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        validators=[MinValueValidator(0)],
        verbose_name='Средний курс покупки'
    )
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')

    class Meta:
        verbose_name = 'Баланс валюты'
        verbose_name_plural = 'Балансы валют'
        unique_together = ['branch', 'currency']
        ordering = ['branch', 'currency']

    def __str__(self):
        return f"{self.branch}: {self.currency} = {self.amount}"
