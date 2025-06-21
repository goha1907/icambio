import jwt
from typing import Optional, Tuple
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request

User = get_user_model()


class SupabaseAuthentication(BaseAuthentication):
    """
    Аутентификация через Supabase JWT токены
    """
    
    def authenticate(self, request: Request) -> Optional[Tuple[User, None]]:
        """
        Аутентифицирует пользователя по JWT токену от Supabase
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
            
        token = auth_header.split(' ')[1]
        
        try:
            # Валидируем и декодируем JWT токен
            payload = self._verify_jwt_token(token)
            
            # Получаем пользователя
            user = self._get_user_from_payload(payload)
            
            return (user, None)
            
        except (jwt.InvalidTokenError, User.DoesNotExist, ValueError) as e:
            raise AuthenticationFailed(f'Invalid token: {str(e)}')
    
    def _verify_jwt_token(self, token: str) -> dict:
        """
        Верифицирует JWT токен от Supabase
        """
        try:
            # Получаем JWT секрет из настроек
            jwt_secret = getattr(settings, 'SUPABASE_JWT_SECRET', None)
            if not jwt_secret:
                raise ValueError("SUPABASE_JWT_SECRET not configured")
            
            # Декодируем токен
            payload = jwt.decode(
                token,
                jwt_secret,
                algorithms=['HS256'],
                audience='authenticated'
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f'Invalid token: {str(e)}')
    
    def _get_user_from_payload(self, payload: dict) -> User:
        """
        Получает или создает пользователя на основе данных из JWT payload
        """
        # Получаем email из payload
        email = payload.get('email')
        if not email:
            raise ValueError("Email not found in token")
        
        # Получаем Supabase user ID
        supabase_user_id = payload.get('sub')  # 'sub' содержит user ID в JWT
        if not supabase_user_id:
            raise ValueError("User ID not found in token")
        
        try:
            # Пытаемся найти пользователя по email
            user = User.objects.get(email=email)
            
            # Обновляем supabase_user_id если он изменился
            if (not hasattr(user, 'supabase_user_id') or
                    user.supabase_user_id != supabase_user_id):
                user.supabase_user_id = supabase_user_id
                user.save(update_fields=['supabase_user_id'])
                
        except User.DoesNotExist:
            # Создаем нового пользователя
            user = User.objects.create(
                email=email,
                username=email,  # используем email как username
                supabase_user_id=supabase_user_id,
                is_active=True
            )
        
        return user


class SupabaseBackend(BaseBackend):
    """
    Django authentication backend для Supabase
    """
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        # Этот backend не используется для обычной аутентификации
        # Он нужен только для совместимости с Django auth system
        return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None 