from django.contrib import admin
from .models import Currency, Branch, ExchangeRate, CurrencyBalance


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'symbol')
    search_fields = ('code', 'name')


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'phone', 'email', 'is_active', 'base_currency')
    list_filter = ('city', 'is_active')
    search_fields = ('name', 'city', 'address')


@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = ('branch', 'from_currency', 'to_currency', 'rate', 'is_active', 'updated_at')
    list_filter = ('branch', 'from_currency', 'to_currency', 'is_active')
    search_fields = ('branch__name', 'from_currency__code', 'to_currency__code')


@admin.register(CurrencyBalance)
class CurrencyBalanceAdmin(admin.ModelAdmin):
    list_display = ('branch', 'currency', 'amount', 'average_purchase_rate', 'updated_at')
    list_filter = ('branch', 'currency')
    search_fields = ('branch__name', 'currency__code')
