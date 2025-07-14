from django.test import TestCase
from django.contrib.auth import get_user_model
from users.authentication import SupabaseJWTAuthentication

User = get_user_model()


class SupabaseJWTAuthenticationTest(TestCase):
    """Тесты для упрощенной аутентификации Supabase"""

    def setUp(self):
        """Подготовка тестовых данных"""
        self.auth = SupabaseJWTAuthentication()
        self.test_email = 'test@example.com'
        self.test_user_data = {
            'email': self.test_email,
            'user_metadata': {
                'first_name': 'Test',
                'last_name': 'User',
                'username': 'testuser'
            }
        }

    def test_create_user_from_jwt(self):
        """Тест создания пользователя из JWT токена"""
        # Создаем пользователя через аутентификацию
        user = self.auth._get_or_create_user(self.test_user_data)
        
        # Проверяем, что пользователь создан
        self.assertIsInstance(user, User)
        self.assertEqual(user.email, self.test_email)
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'User')
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.is_active)

    def test_get_existing_user(self):
        """Тест получения существующего пользователя"""
        # Создаем пользователя вручную
        user = User.objects.create(
            email=self.test_email,
            first_name='Existing',
            last_name='User'
        )
        
        # Получаем пользователя через аутентификацию
        found_user = self.auth._get_or_create_user(self.test_user_data)
        
        # Проверяем, что вернулся тот же пользователь
        self.assertEqual(found_user.id, user.id)
        self.assertEqual(found_user.email, user.email)

    def test_missing_email_in_payload(self):
        """Тест обработки отсутствующего email в payload"""
        payload_without_email = {'user_metadata': {'first_name': 'Test'}}
        
        with self.assertRaises(Exception):
            self.auth._get_or_create_user(payload_without_email) 

    def test_invalid_jwt_token(self):
        """Тест обработки невалидного JWT токена"""
        invalid_token = 'invalid.jwt.token'
        with self.assertRaises(Exception):
            self.auth._decode_jwt(invalid_token) 