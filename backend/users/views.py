from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from users.serializers import (
    UserSerializer, UserProfileUpdateSerializer, UserCreateSerializer,
    ReferralTransactionSerializer, ReferralTransactionCreateSerializer,
    ReferralTransactionUpdateSerializer
)
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from .models import ReferralTransaction
from rest_framework.views import APIView
import requests
import logging

User = get_user_model()
logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с пользователями."""
    
    queryset = User.objects.select_related('address').all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserProfileUpdateSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Получить данные текущего пользователя."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        """Обновить профиль текущего пользователя."""
        serializer = UserProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        """Получить профиль пользователя по ID."""
        user = get_object_or_404(User, pk=pk)
        serializer = self.get_serializer(user)
        return Response(serializer.data)


class ReferralTransactionViewSet(viewsets.ModelViewSet):
    """ViewSet для управления реферальными транзакциями"""
    queryset = ReferralTransaction.objects.select_related('referrer', 'referred')
    serializer_class = ReferralTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'referrer', 'referred']
    search_fields = ['referrer__email', 'referred__email']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return ReferralTransactionCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ReferralTransactionUpdateSerializer
        return ReferralTransactionSerializer


class SupabaseAuthView(APIView):
    """Базовый класс для аутентификации через Supabase"""
    permission_classes = [AllowAny]
    
    def _get_supabase_url(self):
        """Получает URL Supabase из настроек"""
        from django.conf import settings
        return getattr(settings, 'SUPABASE_URL', None)
    
    def _get_supabase_anon_key(self):
        """Получает анонимный ключ Supabase из настроек"""
        from django.conf import settings
        return getattr(settings, 'SUPABASE_ANON_KEY', None)


class RegisterView(SupabaseAuthView):
    """Регистрация пользователя через Supabase"""
    
    def post(self, request):
        """Регистрация нового пользователя"""
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        if not email or not password:
            return Response(
                {'error': 'Email и пароль обязательны'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        supabase_url = self._get_supabase_url()
        supabase_anon_key = self._get_supabase_anon_key()
        
        # Проверяем наличие необходимых переменных Supabase
        if not supabase_url:
            return Response(
                {'error': 'SUPABASE_URL не настроен в переменных окружения'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        if not supabase_anon_key:
            return Response(
                {'error': 'SUPABASE_ANON_KEY не настроен в переменных окружения'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        try:
            # Регистрация через Supabase
            auth_url = f"{supabase_url}/auth/v1/signup"
            headers = {
                'apikey': supabase_anon_key,
                'Content-Type': 'application/json'
            }
            data = {
                'email': email,
                'password': password,
                'data': {
                    'first_name': first_name,
                    'last_name': last_name
                }
            }
            
            response = requests.post(auth_url, json=data, headers=headers)
            
            if response.status_code == 200:
                response.json()  # Проверяем что ответ валидный
                return Response({
                    'message': 'Пользователь успешно зарегистрирован',
                    'user': {
                        'email': email,
                        'first_name': first_name,
                        'last_name': last_name
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                error_data = response.json()
                return Response(
                    {'error': error_data.get('error_description', 'Ошибка регистрации')},
                    status=response.status_code
                )
                
        except Exception as e:
            logger.error(f"Ошибка регистрации: {str(e)}")
            return Response(
                {'error': 'Внутренняя ошибка сервера'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LoginView(SupabaseAuthView):
    """Вход пользователя через Supabase"""
    
    def post(self, request):
        """Вход пользователя"""
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email и пароль обязательны'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        supabase_url = self._get_supabase_url()
        supabase_anon_key = self._get_supabase_anon_key()
        
        # Проверяем наличие необходимых переменных Supabase
        if not supabase_url:
            return Response(
                {'error': 'SUPABASE_URL не настроен в переменных окружения'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        if not supabase_anon_key:
            return Response(
                {'error': 'SUPABASE_ANON_KEY не настроен в переменных окружения'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        try:
            # Вход через Supabase
            auth_url = f"{supabase_url}/auth/v1/token?grant_type=password"
            headers = {
                'apikey': supabase_anon_key,
                'Content-Type': 'application/json'
            }
            data = {
                'email': email,
                'password': password
            }
            
            response = requests.post(auth_url, json=data, headers=headers)
            
            if response.status_code == 200:
                auth_data = response.json()
                return Response({
                    'access_token': auth_data.get('access_token'),
                    'refresh_token': auth_data.get('refresh_token'),
                    'user': auth_data.get('user', {})
                }, status=status.HTTP_200_OK)
            else:
                error_data = response.json()
                return Response(
                    {'error': error_data.get('error_description', 'Неверный email или пароль')},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            logger.error(f"Ошибка входа: {str(e)}")
            return Response(
                {'error': 'Внутренняя ошибка сервера'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(SupabaseAuthView):
    """Выход пользователя через Supabase"""
    
    def post(self, request):
        """Выход пользователя"""
        access_token = request.data.get('access_token')
        
        if not access_token:
            return Response(
                {'error': 'Токен доступа обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        supabase_url = self._get_supabase_url()
        supabase_anon_key = self._get_supabase_anon_key()
        
        if not supabase_url or not supabase_anon_key:
            return Response(
                {'error': 'Supabase не настроен'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        try:
            # Выход через Supabase
            auth_url = f"{supabase_url}/auth/v1/logout"
            headers = {
                'apikey': supabase_anon_key,
                'Authorization': f'Bearer {access_token}'
            }
            
            response = requests.post(auth_url, headers=headers)
            
            if response.status_code == 204:
                return Response({
                    'message': 'Успешный выход'
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Ошибка выхода'},
                    status=response.status_code
                )
                
        except Exception as e:
            logger.error(f"Ошибка выхода: {str(e)}")
            return Response(
                {'error': 'Внутренняя ошибка сервера'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
