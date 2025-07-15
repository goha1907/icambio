from django.urls import path, include
from rest_framework.routers import DefaultRouter
from branches.views import (
    BranchViewSet, BranchHoursViewSet, BranchCurrencyViewSet
)

router = DefaultRouter()
router.register('', BranchViewSet, basename='branch')
router.register('hours', BranchHoursViewSet, basename='branch-hours')
router.register(
    'currencies', BranchCurrencyViewSet, basename='branch-currency'
)

urlpatterns = [
    path('', include(router.urls)),
] 