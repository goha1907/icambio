from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CurrencyViewSet, ExchangeRateViewSet, PurchaseViewSet

router = DefaultRouter()
router.register(r'currencies', CurrencyViewSet)
router.register(r'exchange-rates', ExchangeRateViewSet)
router.register(r'purchases', PurchaseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
