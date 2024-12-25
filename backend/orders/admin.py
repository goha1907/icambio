from django.contrib import admin
from .models import Order, OrderItem, Review


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'branch', 'status', 'client_email', 'created_at')
    list_filter = ('status', 'branch', 'created_at')
    search_fields = ('user__username', 'client_email', 'client_phone')
    inlines = [OrderItemInline]
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('order', 'created_at')
    search_fields = ('order__id', 'text')
    readonly_fields = ('created_at',)
