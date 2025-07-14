import logging
from typing import Optional

from django.contrib.auth import get_user_model
from django.http import HttpRequest


from .authentication import SupabaseJWTAuthentication

logger = logging.getLogger(__name__)
User = get_user_model()


def get_user_from_jwt(request: HttpRequest) -> Optional[User]:
    """
    Извлекает пользователя из JWT токена в заголовке Authorization.
    Автоматически создает пользователя, если он не существует.
    """
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    
    try:
        # Используем существующую логику аутентификации
        auth = SupabaseJWTAuthentication()
        user_auth_tuple = auth.authenticate(request, token=token)
        
        if user_auth_tuple is None:
            return None
            
        user, _ = user_auth_tuple
        return user
        
    except Exception as e:
        logger.warning(
            f"Ошибка при обработке JWT токена в middleware: "
            f"{e}"
        )
        return None


class AutoUserCreationMiddleware:
    """
    Middleware для автоматического создания пользователей из JWT токенов.
    
    Извлекает JWT токен из заголовка Authorization, валидирует его через Supabase
    и автоматически создает/обновляет пользователя в Django.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Получаем пользователя из JWT
        jwt_user = get_user_from_jwt(request)
        
        # Если пользователь найден в JWT, устанавливаем его
        if jwt_user is not None:
            request.user = jwt_user
        # Иначе оставляем существующего пользователя
        # (или AnonymousUser)
        
        response = self.get_response(request)
        return response 