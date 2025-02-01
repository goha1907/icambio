from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone', 'telegram', 'whatsapp', 'bonus_balance', 'is_staff')
    list_filter = ('is_staff', 'is_active', 'groups')
    search_fields = ('username', 'email', 'phone')
    ordering = ('username',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {'fields': ('first_name', 'last_name', 'email', 'phone')}),
        ('Контакты', {'fields': ('telegram', 'whatsapp')}),
        ('Реферальная система', {'fields': ('referral_code', 'referred_by', 'bonus_balance')}),
        ('Права доступа', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )
