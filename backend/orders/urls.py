from django.urls import path, include
from rest_framework.routers import DefaultRouter
from orders.views import OrderViewSet, OrderProfitViewSet

router = DefaultRouter()
router.register('', OrderViewSet, basename='order')
router.register('profits', OrderProfitViewSet, basename='order-profit')

urlpatterns = [
    path('', include(router.urls)),
]
