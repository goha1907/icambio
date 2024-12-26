from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('admin/', admin.site.urls),
    
    # API URLs
    path('api/v1/', include('users.urls')),
    path('api/v1/exchange/', include('exchange.urls')),
    path('api/v1/', include('orders.urls')),
    
    # Authentication URLs
    path('login/', TemplateView.as_view(template_name='auth/login.html'), name='login'),
    path('register/', TemplateView.as_view(template_name='auth/register.html'), name='register'),
    path('logout/', TemplateView.as_view(template_name='auth/logout.html'), name='logout'),
    
    # Profile URLs
    path('profile/', TemplateView.as_view(template_name='users/profile.html'), name='profile'),
    path('orders/', TemplateView.as_view(template_name='orders/list.html'), name='orders'),
    
    # Branches URLs
    path('branches/', TemplateView.as_view(template_name='exchange/branches.html'), name='branches'),
    
    # Information pages
    path('about/', TemplateView.as_view(template_name='pages/about.html'), name='about'),
    path('contacts/', TemplateView.as_view(template_name='pages/contacts.html'), name='contacts'),
    path('exchange-rules/', TemplateView.as_view(template_name='pages/exchange-rules.html'), name='exchange_rules'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
