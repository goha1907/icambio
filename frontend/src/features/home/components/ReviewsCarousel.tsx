import { useState, useEffect, memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Review } from '@/features/exchange/types';
import { MOCK_REVIEWS } from '@/lib/mock-data';

// Мемоизированный компонент отзыва
const ReviewItem = memo(({ review }: { review: Review }) => (
  <div className="bg-gray-50 p-4 rounded-lg h-full flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="font-medium">{`${review.user.name} ${review.user.lastname}`}</div>
        </div>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
    </div>
    <div className="text-xs text-gray-500 mt-2 text-right">
      {new Date(review.created_at).toLocaleDateString()}
    </div>
  </div>
));

ReviewItem.displayName = 'ReviewItem';

interface ReviewsCarouselProps {
  autoplayInterval?: number;
  visibleItems?: number;
}

export const ReviewsCarousel = ({
  autoplayInterval = 10000,
  visibleItems = 3,
}: ReviewsCarouselProps) => {
  const reviews = MOCK_REVIEWS;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Автоматическое перелистывание
  useEffect(() => {
    if (reviews.length <= visibleItems) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Возвращаемся к началу, если достигли конца
        return nextIndex + visibleItems > reviews.length ? 0 : nextIndex;
      });
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [reviews.length, visibleItems, autoplayInterval]);

  // Если отзывов нет или меньше, чем нужно показать
  if (!reviews.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Отзывы пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Пока нет отзывов</p>
        </CardContent>
      </Card>
    );
  }

  // Получаем текущие отзывы для отображения
  const visibleReviews = 
  reviews.length <= visibleItems
    ? reviews
    : [
        ...reviews.slice(currentIndex, Math.min(currentIndex + visibleItems, reviews.length)),
        ...reviews.slice(0, Math.max(0, currentIndex + visibleItems - reviews.length)),
      ];

return (
  <Card>
    <CardHeader>
      <CardTitle>Отзывы пользователей</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {/* Индикаторы страниц... */}
    </CardContent>
  </Card>
);
};
