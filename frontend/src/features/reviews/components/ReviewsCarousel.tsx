import { useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Review } from '@/features/exchange/types';
import { MOCK_REVIEWS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

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
  const [isPaused, setIsPaused] = useState(false);

  // Функция для перехода к следующему слайду
  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex + visibleItems > reviews.length ? 0 : nextIndex;
    });
  };

  // Функция для перехода к предыдущему слайду
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        // Переходим к последнему возможному индексу
        return Math.max(0, reviews.length - visibleItems);
      }
      return prevIndex - 1;
    });
  };

  // Автоматическое перелистывание
  useEffect(() => {
    if (reviews.length <= visibleItems || isPaused) return;

    const interval = setInterval(goToNext, autoplayInterval);
    return () => clearInterval(interval);
  }, [reviews.length, visibleItems, autoplayInterval, isPaused]);

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

  // Проверяем, нужны ли стрелки навигации
  const showNavigation = reviews.length > visibleItems;

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
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Стрелка влево */}
          {showNavigation && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200",
                "hover:scale-110 focus:scale-110"
              )}
              onClick={goToPrevious}
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Button>
          )}

          {/* Сетка отзывов */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-4",
            showNavigation && "mx-12" // Добавляем отступы для стрелок
          )}>
            {visibleReviews.map((review, index) => (
              <ReviewItem key={`${review.id}-${currentIndex}-${index}`} review={review} />
            ))}
          </div>

          {/* Стрелка вправо */}
          {showNavigation && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200",
                "hover:scale-110 focus:scale-110"
              )}
              onClick={goToNext}
              aria-label="Следующий отзыв"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </Button>
          )}
        </div>

        {/* Индикаторы страниц */}
        {showNavigation && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(reviews.length / visibleItems) }).map((_, index) => {
              const pageStartIndex = index * visibleItems;
              const isActive = currentIndex >= pageStartIndex && currentIndex < pageStartIndex + visibleItems;
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(pageStartIndex)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    isActive 
                      ? "bg-icmop-primary scale-125" 
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                  aria-label={`Перейти к странице ${index + 1}`}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
