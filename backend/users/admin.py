from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from users.models import User, ReferralTransaction


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = [
        'email', 'first_name', 'last_name', 'role', 'referral_code',
        'is_active', 'created_at'
    ]
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['email', 'first_name', 'last_name', 'referral_code']
    ordering = ['email']
    
    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        ('Личная информация', {
            'fields': ('username', 'first_name', 'last_name')
        }),
        ('Контакты', {
            'fields': ('whatsapp', 'telegram', 'address')
        }),
        ('Реферальная система', {
            'fields': (
                'referral_code', 'referred_by_code',
                'referral_amount'
            ),
            'classes': ('collapse',)
        }),
        ('Права доступа', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Важные даты', {
            'fields': ('last_login', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ['referral_code', 'created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('address')


@admin.register(ReferralTransaction)
class ReferralTransactionAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'type', 'amount', 'currency', 'branch', 'created_at'
    ]
    list_filter = ['type', 'currency', 'branch', 'created_at']
    search_fields = ['user__email', 'note']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {
            'fields': ('user', 'type', 'amount', 'currency')
        }),
        ('Связанные объекты', {
            'fields': ('referred_user', 'order', 'branch'),
            'classes': ('collapse',)
        }),
        ('Дополнительно', {
            'fields': ('note', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'referred_user', 'currency', 'branch'
        )
