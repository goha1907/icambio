from django.contrib import admin
from orders.models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'branch', 'currency_from', 'currency_to',
        'amount_from', 'amount_to', 'status', 'delivery', 'created_at'
    ]
    list_filter = [
        'status', 'delivery', 'branch', 'currency_from', 'currency_to',
        'created_at', 'completed_at'
    ]
    search_fields = [
        'id', 'user__email', 'user__first_name', 'user__last_name'
    ]
    readonly_fields = ['created_at', 'completed_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'branch', 'status')
        }),
        ('Валюты и суммы', {
            'fields': (
                'currency_from', 'currency_to', 'amount_from',
                'amount_to', 'applied_rate'
            )
        }),
        ('Доставка', {
            'fields': ('delivery', 'delivery_address')
        }),
        ('Временные метки', {
            'fields': ('created_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'branch', 'currency_from', 'currency_to',
            'delivery_address'
        )
