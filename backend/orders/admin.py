from django.contrib import admin
from .models import Order, OrderItem, Review


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'branch', 'status',
        'total_from_amount', 'total_to_amount',
        'created_at'
    )
    list_filter = ('status', 'branch', 'created_at')
    search_fields = ('user__username', 'client_email', 'client_phone')
    readonly_fields = ('created_at', 'updated_at', 'total_from_amount', 'total_to_amount')
    actions = ['mark_as_completed', 'mark_as_cancelled']

    def mark_as_completed(self, request, queryset):
        queryset.update(status='COMPLETED')
    mark_as_completed.short_description = "Mark selected orders as completed"

    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='CANCELLED')
    mark_as_cancelled.short_description = "Mark selected orders as cancelled"


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('order', 'created_at')
    search_fields = ('order__id', 'text')
    readonly_fields = ('created_at',)
