import logging

from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()


class AutoUserCreationMiddleware:
    """
    Middleware для автоматического создания пользователей.
    
    В будущем может быть расширен для дополнительной логики,
    связанной с пользователями.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Пока оставляем пустым, так как аутентификация
        # теперь обрабатывается Django Allauth и DRF Simple JWT
        # В будущем здесь может быть дополнительная логика
        
        response = self.get_response(request)
        return response 