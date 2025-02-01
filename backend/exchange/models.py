from django.db import models


class Currency(models.Model):
    """Модель валюты."""
    code = models.CharField('Код валюты', max_length=10, unique=True)
    name = models.CharField('Название', max_length=50)
    symbol = models.CharField('Символ', max_length=5)
    is_active = models.BooleanField('Активна', default=True)

    class Meta:
        verbose_name = 'Валюта'
        verbose_name_plural = 'Валюты'

    def __str__(self):
        return f"{self.code} - {self.name}"


class ExchangeRate(models.Model):
    """Модель курса обмена."""
    from_currency = models.ForeignKey(
        Currency,
        related_name='rates_from',
        on_delete=models.CASCADE,
        verbose_name='Из валюты'
    )
    to_currency = models.ForeignKey(
        Currency,
        related_name='rates_to',
        on_delete=models.CASCADE,
        verbose_name='В валюту'
    )
    rate = models.DecimalField(
        'Курс',
        max_digits=10,
        decimal_places=4
    )
    min_amount = models.DecimalField(
        'Минимальная сумма',
        max_digits=10,
        decimal_places=2
    )
    is_active = models.BooleanField('Активен', default=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Курс обмена'
        verbose_name_plural = 'Курсы обмена'
        unique_together = ['from_currency', 'to_currency']

    def __str__(self):
        return f"{self.from_currency.code} -> {self.to_currency.code}: {self.rate}"


class ExchangeOffice(models.Model):
    """Модель обменного пункта."""
    name = models.CharField('Название', max_length=100)
    address = models.TextField('Адрес')
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
    is_active = models.BooleanField('Активен', default=True)

    class Meta:
        verbose_name = 'Обменный пункт'
        verbose_name_plural = 'Обменные пункты'

    def __str__(self):
        return self.name


class CurrencyBalance(models.Model):
    """Модель баланса валют в обменном пункте."""
    office = models.ForeignKey(
        ExchangeOffice,
        on_delete=models.CASCADE,
        related_name='balances',
        verbose_name='Обменный пункт'
    )
    currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        verbose_name='Валюта'
    )
    balance = models.DecimalField(
        'Баланс',
        max_digits=15,
        decimal_places=2
    )

    class Meta:
        verbose_name = 'Баланс валюты'
        verbose_name_plural = 'Балансы валют'
        unique_together = ['office', 'currency']

    def __str__(self):
        return f"{self.office.name} - {self.currency.code}: {self.balance}"
