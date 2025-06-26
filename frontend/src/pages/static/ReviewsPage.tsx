// import { useMemo } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { ReviewsCarousel } from '@/features/home/components/ReviewsCarousel';
import { useReviews } from '@/features/reviews/hooks/useReviews';

export const ReviewsPage = () => {
  const { data: reviews, isLoading, isError } = useReviews();

  return (
    <div className="page-container">
      <div className="page-content">
        <PageTitle 
          title="Отзывы наших клиентов" 
          description="Что говорят о нас пользователи сервиса"
        />
        
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            {isLoading && <p>Загрузка отзывов...</p>}
            {isError && <p>Ошибка загрузки отзывов.</p>}
            {reviews && <ReviewsCarousel />}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-icmop-primary">Оставить отзыв</h2>
            <p className="text-gray-600 mb-4">
              Мы ценим ваше мнение! Поделитесь своим опытом использования нашего сервиса.
            </p>
            {/* TODO: Добавить форму для отзывов */}
          </div>
        </div>
      </div>
    </div>
  );
}; 