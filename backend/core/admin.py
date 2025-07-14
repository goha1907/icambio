from django.contrib import admin
from .models import Address


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
