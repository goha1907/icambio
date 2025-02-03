from django.contrib import admin
from exchange.models import (
    Currency,
    ExchangeRate,
    ExchangeOffice,
    CurrencyBalance
)


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'symbol', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('code', 'name')
    ordering = ('code',)


@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = ('from_currency', 'to_currency', 'rate',
                    'min_amount', 'is_active', 'updated_at')
    list_filter = ('is_active', 'from_currency', 'to_currency')
    search_fields = ('from_currency__code', 'to_currency__code')
    ordering = ('from_currency', 'to_currency')


@admin.register(ExchangeOffice)
class ExchangeOfficeAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'address')


@admin.register(CurrencyBalance)
class CurrencyBalanceAdmin(admin.ModelAdmin):
    list_display = ('office', 'currency', 'balance')
    list_filter = ('office', 'currency')
    search_fields = ('office__name', 'currency__code')
