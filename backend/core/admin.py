from django.contrib import admin
from .models import Address, CurrencyMovement


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['full_address', 'country', 'city', 'created_at']
    list_filter = ['country', 'city', 'created_at']
    search_fields = ['full_address', 'country', 'city', 'street']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('full_address', 'country', 'city')
        }),
        ('Детали адреса', {
            'fields': ('street', 'house_number', 'postal_code')
        }),
        ('Координаты', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(CurrencyMovement)
class CurrencyMovementAdmin(admin.ModelAdmin):
    list_display = [
        'branch', 'currency', 'type', 'amount', 'user', 'created_at'
    ]
    list_filter = [
        'type', 'branch', 'currency', 'created_at'
    ]
    search_fields = [
        'branch__name', 'currency__code', 'user__email', 'reason'
    ]
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('branch', 'currency', 'type', 'amount')
        }),
        ('Связанные объекты', {
            'fields': (
                'user', 'order', 'purchase', 'referral_transaction'
            ),
            'classes': ('collapse',)
        }),
        ('Дополнительно', {
            'fields': ('reason', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'branch', 'currency', 'user'
        )
