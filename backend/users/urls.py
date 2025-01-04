from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path(
        'users/check-referral/<str:code>/',
        UserViewSet.as_view({'get': 'check_referral'}),
        name='check-referral'
    ),
]
