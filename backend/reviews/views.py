from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import (
    DjangoFilterBackend, FilterSet, DateFromToRangeFilter
)
from rest_framework.filters import SearchFilter, OrderingFilter
from users.permissions import IsOwnerOrOperator
from reviews.models import Review
from reviews.serializers import (
    ReviewSerializer, ReviewListSerializer, ReviewCreateSerializer,
    ReviewUpdateSerializer, ReviewPublicSerializer
)
from django.db import models
from rest_framework.pagination import PageNumberPagination


class ReviewFilter(FilterSet):
    created_at = DateFromToRangeFilter()

    class Meta:
        model = Review
        fields = [
            'rating', 'visible', 'order', 'user', 'created_at'
        ]


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с отзывами."""
    
    permission_classes = [IsOwnerOrOperator]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ReviewFilter
    filterset_fields = ['rating', 'visible', 'order']
    search_fields = [
        'comment', 'user__email', 'user__first_name',
        'user__last_name', 'order__id'
    ]
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        # Операторы и выше видят все отзывы, обычные пользователи - только свои
        if self.request.user.role in ['operator', 'admin', 'owner']:
            return Review.objects.select_related('user', 'order')
        else:
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


class PublicReviewPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 50


class ReviewPublicViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для публичного доступа к отзывам."""
    
    serializer_class = ReviewPublicSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ReviewFilter
    filterset_fields = ['rating', 'visible']
    search_fields = [
        'comment', 'user__first_name', 'user__last_name', 'order__id'
    ]
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']
    pagination_class = PublicReviewPagination
    
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
