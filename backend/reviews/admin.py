from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'order', 'rating', 'visible', 'created_at']
    list_filter = ['rating', 'visible', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'comment']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'order', 'rating')
        }),
        ('Содержание', {
            'fields': ('comment',)
        }),
        ('Настройки', {
            'fields': ('visible',)
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'order')
