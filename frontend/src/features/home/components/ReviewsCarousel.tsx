import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface Review {
  id: string | number;
  username: string;
  text: string;
  rating: number;
  date: string;
}

interface ReviewsCarouselProps {
  reviews: Review[];
  autoplayInterval?: number;
  visibleItems?: number;
}

export const ReviewsCarousel = ({
  reviews,
  autoplayInterval = 10000,
  visibleItems = 3,
}: ReviewsCarouselProps) => {
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
            <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{review.username}</div>
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
              <p className="text-sm text-gray-600 mb-2">{review.text}</p>
              <div className="text-xs text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Индикаторы страниц (если есть больше отзывов, чем можно показать) */}
        {reviews.length > visibleItems && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(reviews.length / visibleItems) }).map((_, index) => {
              const isActive =
                index === Math.floor(currentIndex / visibleItems) ||
                (index === 0 && currentIndex + visibleItems > reviews.length);

              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * visibleItems)}
                  className={`mx-1 w-2 h-2 rounded-full ${
                    isActive ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
