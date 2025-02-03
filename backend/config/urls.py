from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth URLs
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    # API URLs
    path('api/v1/', include('users.urls')),
    path('api/v1/', include('orders.urls')),
    path('api/v1/', include('exchange.urls')),  # добавим позже
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
