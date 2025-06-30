import jwt
import logging
from typing import Optional, Tuple, Any
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


User = get_user_model()


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Аутентификация через JWT токены Supabase
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
        Декодирует JWT токен от Supabase
        """
        try:
            # Получаем публичный ключ от Supabase
            jwt_secret = settings.SUPABASE_JWT_SECRET

            # Декодируем токен
            payload = jwt.decode(
                token,
                jwt_secret,
                algorithms=['HS256'],
                options={'verify_aud': False}
            )

            return payload

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f'Invalid token: {str(e)}')

    def _get_or_create_user(self, payload: dict) -> User:
        """
        Получает или создаёт пользователя на основе данных из JWT
        """
        supabase_user_id = payload.get('sub')
        email = payload.get('email')

        if not supabase_user_id or not email:
            raise AuthenticationFailed('Invalid token payload')

        # 1. Поиск по Supabase ID
        try:
            return User.objects.get(supabase_user_id=supabase_user_id)
        except User.DoesNotExist:
            pass

        # 2. Поиск по email (может быть другой Supabase ID — проверим)
        try:
            user = User.objects.get(email=email)

            if user.supabase_user_id and user.supabase_user_id != supabase_user_id:
                raise AuthenticationFailed(
                    "Email conflict: this email is already "
                    "linked to another Supabase ID"
                )

            user.supabase_user_id = supabase_user_id
            user.save()
            return user

        except User.DoesNotExist:
            pass

        # 3. Создание нового пользователя
        user = User.objects.create(
            email=email,
            supabase_user_id=supabase_user_id,
            is_active=True,
            first_name=payload.get('user_metadata', {}).get('first_name', ''),
            last_name=payload.get('user_metadata', {}).get('last_name', ''),
            username=payload.get(
                'user_metadata', {}
            ).get('username') or email.split('@')[0],
        )

        logger = logging.getLogger(__name__)
        logger.info(
            f"Created new user from Supabase: {email} ({supabase_user_id})"
        )

        return user


class SupabaseServiceAuthentication(BaseAuthentication):
    """
    Аутентификация для сервисных запросов с service_role ключом
    """

    def authenticate(self, request) -> Optional[Tuple[Any, str]]:
        """
        Проверяет service_role ключ для административных операций
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        # Проверяем, что это service_role ключ
        if token == settings.SUPABASE_SERVICE_ROLE_KEY:
            # Возвращаем специальный объект для service операций
            return (None, token)

        return None


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
