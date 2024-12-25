from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
