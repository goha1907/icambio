from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CurrencyViewSet,
    BranchViewSet,
    ExchangeRateViewSet,
    CurrencyBalanceViewSet
)

router = DefaultRouter()
router.register(r'currencies', CurrencyViewSet)
router.register(r'branches', BranchViewSet)
router.register(r'rates', ExchangeRateViewSet)
router.register(r'balances', CurrencyBalanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
