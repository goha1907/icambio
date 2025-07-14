from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock

from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.http import HttpResponse

from users.middleware import AutoUserCreationMiddleware, get_user_from_jwt

User = get_user_model()


class AutoUserCreationMiddlewareTest(TestCase):
    """Тесты для AutoUserCreationMiddleware"""

    def setUp(self):
        self.factory = RequestFactory()
        self.middleware = AutoUserCreationMiddleware(lambda request: HttpResponse())
        
        # Создаем тестовый JWT токен
        self.test_payload = {
            'sub': 'test-user-id',
            'email': 'test@example.com',
            'exp': datetime.utcnow() + timedelta(hours=1),
            'iat': datetime.utcnow(),
        }
        
    def test_middleware_without_token(self):
        """Тест middleware без токена"""
        request = self.factory.get('/test/')
        request.user = None
        
        response = self.middleware(request)
        
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(request.user)
        
    @patch('users.middleware.SupabaseJWTAuthentication')
    def test_middleware_with_valid_token_new_user(self, mock_auth_class):
        """Тест middleware с валидным токеном для нового пользователя"""
        # Мокаем аутентификацию
        mock_auth = MagicMock()
        mock_auth_class.return_value = mock_auth
        
        # Создаем тестового пользователя
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        mock_auth.authenticate.return_value = (user, None)
        
        # Создаем запрос с токеном
        request = self.factory.get('/test/')
        request.META['HTTP_AUTHORIZATION'] = 'Bearer valid-token'
        request.user = None
        
        response = self.middleware(request)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(request.user, user)
        mock_auth.authenticate.assert_called_once_with(request, token='valid-token')
        
    @patch('users.middleware.SupabaseJWTAuthentication')
    def test_middleware_with_invalid_token(self, mock_auth_class):
        """Тест middleware с невалидным токеном"""
        # Мокаем аутентификацию
        mock_auth = MagicMock()
        mock_auth_class.return_value = mock_auth
        mock_auth.authenticate.return_value = None
        
        # Создаем запрос с невалидным токеном
        request = self.factory.get('/test/')
        request.META['HTTP_AUTHORIZATION'] = 'Bearer invalid-token'
        request.user = None
        
        response = self.middleware(request)
        
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(request.user)
        mock_auth.authenticate.assert_called_once_with(request, token='invalid-token')
        
    @patch('users.middleware.SupabaseJWTAuthentication')
    def test_middleware_with_exception(self, mock_auth_class):
        """Тест middleware с исключением при обработке токена"""
        # Мокаем аутентификацию с исключением
        mock_auth = MagicMock()
        mock_auth_class.return_value = mock_auth
        mock_auth.authenticate.side_effect = Exception("Test error")
        
        # Создаем запрос с токеном
        request = self.factory.get('/test/')
        request.META['HTTP_AUTHORIZATION'] = 'Bearer test-token'
        request.user = None
        
        response = self.middleware(request)
        
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(request.user)
        
    def test_middleware_with_malformed_header(self):
        """Тест middleware с неправильно сформированным заголовком"""
        # Создаем запрос с неправильным заголовком
        request = self.factory.get('/test/')
        request.META['HTTP_AUTHORIZATION'] = 'InvalidHeader'
        request.user = None
        
        response = self.middleware(request)
        
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(request.user)


class GetUserFromJWTTest(TestCase):
    """Тесты для функции get_user_from_jwt"""

    def setUp(self):
        self.factory = RequestFactory()
        
    def test_get_user_from_jwt_without_header(self):
        """Тест функции без заголовка Authorization"""
        request = self.factory.get('/test/')
        
        result = get_user_from_jwt(request)
        
        self.assertIsNone(result)
        
    def test_get_user_from_jwt_with_malformed_header(self):
        """Тест функции с неправильно сформированным заголовком"""
        request = self.factory.get('/test/')
        request.META['HTTP_AUTHORIZATION'] = 'InvalidHeader'
        
        result = get_user_from_jwt(request)
        
        self.assertIsNone(result)
        
    @patch('users.middleware.SupabaseJWTAuthentication')
    def test_get_user_from_jwt_with_valid_token(self, mock_auth_class):
        """Тест функции с валидным токеном"""
        # Мокаем аутентификацию
        mock_auth = MagicMock()
        mock_auth_class.return_value = mock_auth
        
        # Создаем тестового пользователя
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        mock_auth.authenticate.return_value = (user, None)
        
        # Создаем запрос с токеном
        request = self.factory.get('/test/')
        request.META['HTTP_AUTHORIZATION'] = 'Bearer valid-token'
        
        result = get_user_from_jwt(request)
        
        self.assertEqual(result, user)
        mock_auth.authenticate.assert_called_once_with(request, token='valid-token')
        
    @patch('users.middleware.SupabaseJWTAuthentication')
    def test_get_user_from_jwt_with_exception(self, mock_auth_class):
        """Тест функции с исключением при обработке токена"""
        # Мокаем аутентификацию с исключением
        mock_auth = MagicMock()
        mock_auth_class.return_value = mock_auth
        mock_auth.authenticate.side_effect = Exception("Test error")
        
        # Создаем запрос с токеном
        request = self.factory.get('/test/')
        request.META['HTTP_AUTHORIZATION'] = 'Bearer test-token'
        
        result = get_user_from_jwt(request)
        
        self.assertIsNone(result) 