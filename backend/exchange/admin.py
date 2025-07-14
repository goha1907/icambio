from django.contrib import admin
from exchange.models import Currency, ExchangeRate


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'symbol', 'decimal_places', 'created_at']
    list_filter = ['created_at']
    search_fields = ['code', 'name']
    ordering = ['code']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('code', 'name', 'symbol')
        }),
        ('Настройки', {
            'fields': ('decimal_places',)
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = [
        'currency_from', 'currency_to', 'branch', 'rate',
        'min_amount', 'max_amount', 'is_hot', 'visible', 'in_filter'
    ]
    list_filter = [
        'is_hot', 'visible', 'in_filter', 'currency_from', 'currency_to',
        'branch', 'updated_at'
    ]
    search_fields = [
        'currency_from__code', 'currency_to__code', 'branch__name'
    ]
    readonly_fields = ['updated_at']
    
    fieldsets = (
        ('Валюты и филиал', {
            'fields': ('currency_from', 'currency_to', 'branch')
        }),
        ('Курс и суммы', {
            'fields': ('rate', 'min_amount', 'max_amount')
        }),
        ('Настройки отображения', {
            'fields': ('is_hot', 'visible', 'in_filter')
        }),
        ('Системная информация', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'currency_from', 'currency_to', 'branch'
        )
