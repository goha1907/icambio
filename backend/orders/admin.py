from django.contrib import admin
from orders.models import Order, OrderDocument, OrderItem, Review


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ('from_currency', 'amount_from',
              'to_currency', 'amount_to', 'rate')


class OrderDocumentInline(admin.TabularInline):
    model = OrderDocument
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'office',
                    'status', 'created_at', 'has_delivery')
    list_filter = ('status', 'office', 'created_at')
    search_fields = ('id', 'user__username', 'user__email')
    inlines = [OrderItemInline, OrderDocumentInline]
    ordering = ('-created_at',)

    def has_delivery(self, obj):
        return bool(obj.delivery_address)
    has_delivery.short_description = 'Доставка'
    has_delivery.boolean = True


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('order', 'rating', 'created_at', 'is_visible')
    list_filter = ('rating', 'is_visible')
    search_fields = ('order__id', 'text')
    ordering = ('-created_at',)
