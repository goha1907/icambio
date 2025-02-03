from django.urls import path, include
from rest_framework.routers import DefaultRouter
from exchange.views import (
    CurrencyViewSet,
    ExchangeRateViewSet,
    ExchangeOfficeViewSet,
    CurrencyBalanceViewSet
)

router = DefaultRouter()
router.register('currencies', CurrencyViewSet, basename='currency')
router.register('rates', ExchangeRateViewSet, basename='rate')
router.register('offices', ExchangeOfficeViewSet, basename='office')
router.register('balances', CurrencyBalanceViewSet, basename='balance')

urlpatterns = [
    path('', include(router.urls)),
]
