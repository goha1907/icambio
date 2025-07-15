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


User = get_user_model()


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
