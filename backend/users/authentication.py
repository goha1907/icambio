import jwt
import logging
from typing import Optional, Tuple
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


User = get_user_model()


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Упрощенная аутентификация через JWT токены Supabase
    """

    def authenticate(self, request) -> Optional[Tuple[User, str]]:
        """
        Аутентифицирует пользователя по JWT токену от Supabase
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        try:
            # Декодируем JWT токен
            payload = self._decode_jwt(token)

            # Получаем или создаём пользователя
            user = self._get_or_create_user(payload)

            return (user, token)

        except Exception as e:
            raise AuthenticationFailed(f'Invalid token: {str(e)}')

    def _decode_jwt(self, token: str) -> dict:
        """
        Декодирует JWT токен от Supabase с явной проверкой секрета и логированием ошибок
        """
        try:
            # Сначала пробуем Supabase JWT
            jwt_secret = settings.SUPABASE_JWT_SECRET
            if jwt_secret:
                try:
                    payload = jwt.decode(
                        token,
                        jwt_secret,
                        algorithms=['HS256'],
                        options={'verify_aud': False}
                    )
                    return payload
                except jwt.ExpiredSignatureError:
                    logging.warning('Supabase JWT expired')
                    raise AuthenticationFailed('Token has expired')
                except jwt.InvalidTokenError:
                    # Если не Supabase токен, пробуем Django токен
                    pass
            
            # Тестовая версия - используем Django SECRET_KEY
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=['HS256']
            )
            return payload
            
        except jwt.InvalidTokenError as e:
            logging.warning(f'JWT invalid: {e}')
            raise AuthenticationFailed(f'Invalid token: {str(e)}')

    def _get_or_create_user(self, payload: dict) -> User:
        """
        Получает или создаёт пользователя на основе email из JWT
        """
        email = payload.get('email')
        
        # Отладочная информация
        logger = logging.getLogger(__name__)
        logger.info(f"Processing JWT payload for email: {email}")
        logger.info(f"Payload keys: {list(payload.keys())}")
        logger.info(f"User metadata: {payload.get('user_metadata', {})}")

        if not email:
            raise AuthenticationFailed('Email not found in token payload')

        # Ищем пользователя по email
        try:
            user = User.objects.get(email=email)
            logger.info(f"Found existing user: {user.email}")
            return user
        except User.DoesNotExist:
            logger.info(f"User not found, creating new user for: {email}")
            pass

        # Создаем нового пользователя
        user_metadata = payload.get('user_metadata', {})
        
        try:
            user = User.objects.create(
                email=email,
                is_active=True,
                first_name=user_metadata.get('first_name', ''),
                last_name=user_metadata.get('last_name', ''),
                username=user_metadata.get('username') or email.split('@')[0],
            )
            logger.info(f"Successfully created new user from Supabase: {email}")
            return user
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise AuthenticationFailed(f'Error creating user: {str(e)}')


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
