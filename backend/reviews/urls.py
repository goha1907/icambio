from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reviews.views import ReviewViewSet, ReviewPublicViewSet

router = DefaultRouter()
router.register('', ReviewViewSet, basename='review')
router.register('public', ReviewPublicViewSet, basename='review-public')

urlpatterns = [
    path('', include(router.urls)),
] 