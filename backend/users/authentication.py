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
            jwt_secret = settings.SUPABASE_JWT_SECRET
            if not jwt_secret:
                logging.error('SUPABASE_JWT_SECRET is not set')
                raise AuthenticationFailed('SUPABASE_JWT_SECRET is not set')
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
        except jwt.InvalidTokenError as e:
            logging.warning(f'Supabase JWT invalid: {e}')
            raise AuthenticationFailed(f'Invalid token: {str(e)}')

    def _get_or_create_user(self, payload: dict) -> User:
        """
        Получает или создаёт пользователя на основе email из JWT
        """
        email = payload.get('email')

        if not email:
            raise AuthenticationFailed('Email not found in token payload')

        # Ищем пользователя по email
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            pass

        # Создаем нового пользователя
        user_metadata = payload.get('user_metadata', {})
        
        user = User.objects.create(
            email=email,
            is_active=True,
            first_name=user_metadata.get('first_name', ''),
            last_name=user_metadata.get('last_name', ''),
            username=user_metadata.get('username') or email.split('@')[0],
        )

        logger = logging.getLogger(__name__)
        logger.info(f"Created new user from Supabase: {email}")

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
