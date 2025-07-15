from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AddressViewSet, CurrencyMovementViewSet

router = DefaultRouter()
router.register(r'addresses', AddressViewSet)
router.register(r'currency-movements', CurrencyMovementViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 