from django.urls import path, include
from rest_framework.routers import DefaultRouter
from orders.views import OrderViewSet, OrderTrackingView, ReviewViewSet

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='order')
router.register('reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
    path('track/<str:tracking_code>/',
         OrderTrackingView.as_view(),
         name='order-tracking'),
]
