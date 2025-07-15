from django.contrib import admin
from .models import Branch, BranchHours, BranchCurrency


class BranchHoursInline(admin.TabularInline):
    model = BranchHours
    extra = 7
    max_num = 7


class BranchCurrencyInline(admin.TabularInline):
    model = BranchCurrency
    extra = 1


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'email', 'address__full_address']
    readonly_fields = ['created_at']
    
    inlines = [BranchHoursInline, BranchCurrencyInline]
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'email', 'is_active')
        }),
        ('Контакты', {
            'fields': ('whatsapp', 'telegram', 'instagram')
        }),
        ('Адрес', {
            'fields': ('address',)
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(BranchHours)
class BranchHoursAdmin(admin.ModelAdmin):
    list_display = ['branch', 'weekday', 'open_time', 'close_time', 'is_open']
    list_filter = ['branch', 'weekday', 'is_open']
    search_fields = ['branch__name']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('branch')


@admin.register(BranchCurrency)
class BranchCurrencyAdmin(admin.ModelAdmin):
    list_display = ['branch', 'currency', 'amount']
    list_filter = ['branch', 'currency']
    search_fields = ['branch__name', 'currency__code', 'currency__name']
    
    fieldsets = (
        (None, {
            'fields': ('branch', 'currency', 'amount')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'branch', 'currency'
        )
