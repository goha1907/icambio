from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from reviews.models import Review
from reviews.serializers import (
    ReviewSerializer, ReviewListSerializer, ReviewCreateSerializer,
    ReviewUpdateSerializer, ReviewPublicSerializer
)
from django.db import models


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с отзывами."""
    
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['rating', 'visible', 'order']
    search_fields = ['comment']
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Review.objects.select_related(
            'user', 'order'
        ).filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ReviewUpdateSerializer
        elif self.action == 'list':
            return ReviewListSerializer
        return ReviewSerializer
    
    def perform_create(self, serializer):
        """Создание отзыва с привязкой к пользователю."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Получить отзывы текущего пользователя."""
        reviews = self.get_queryset()
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def visible(self, request):
        """Получить видимые отзывы."""
        reviews = self.get_queryset().filter(visible=True)
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_rating(self, request):
        """Получить отзывы по рейтингу."""
        rating = request.query_params.get('rating')
        if rating:
            reviews = self.get_queryset().filter(rating=rating)
        else:
            reviews = self.get_queryset()
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)


class ReviewPublicViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для публичного доступа к отзывам."""
    
    serializer_class = ReviewPublicSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['rating', 'visible']
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Review.objects.select_related(
            'user', 'order'
        ).filter(visible=True)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Получить последние отзывы."""
        reviews = self.get_queryset()[:10]
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Получить отзывы с высоким рейтингом."""
        reviews = self.get_queryset().filter(rating__gte=4)[:10]
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Получить статистику отзывов."""
        total_reviews = self.get_queryset().count()
        avg_rating = self.get_queryset().aggregate(
            avg_rating=models.Avg('rating')
        )['avg_rating'] or 0
        
        rating_counts = {}
        for i in range(1, 6):
            rating_counts[i] = self.get_queryset().filter(rating=i).count()
        
        return Response({
            'total_reviews': total_reviews,
            'average_rating': round(avg_rating, 2),
            'rating_distribution': rating_counts
        })
