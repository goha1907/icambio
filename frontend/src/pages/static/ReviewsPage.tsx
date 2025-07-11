import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/shared/ui/Modal';
import { MOCK_REVIEWS } from '@/shared/lib/mock-data';

interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    lastname: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

const REVIEWS_PER_PAGE = 9;

export const ReviewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  // Преобразуем данные из моков в нужный формат
  const processedReviews = useMemo(() => {
    return MOCK_REVIEWS.map(review => ({
      ...review,
      name: `${review.user.name} ${review.user.lastname}`,
      date: new Date(review.created_at).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
  }, []);

  // Фильтрация отзывов по рейтингу
  const filteredReviews = useMemo(() => {
    if (selectedRating === null) {
      return processedReviews;
    }
    return processedReviews.filter(review => review.rating === selectedRating);
  }, [processedReviews, selectedRating]);

  // Пагинация
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentReviews = filteredReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  // Сброс страницы при изменении фильтра
  const handleRatingFilter = (rating: number | null) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  // Статистика отзывов
  const reviewStats = useMemo(() => {
    const total = processedReviews.length;
    const ratingCounts = processedReviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const averageRating = processedReviews.reduce((sum, review) => sum + review.rating, 0) / total;
    
    return { total, ratingCounts, averageRating };
  }, [processedReviews]);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-xl'
    };
    
    return (
      <div className={`flex ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Кнопка "Предыдущая"
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          ←
        </button>
      );
    }

    // Номера страниц
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            i === currentPage
              ? 'bg-icambio-primary text-white border-icambio-primary'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Кнопка "Следующая"
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          →
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        {pages}
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageTitle
          title="Отзывы наших клиентов"
          description="Реальные отзывы пользователей о качестве нашего сервиса обмена валют"
        />

        {/* Статистика отзывов */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                <span className="text-blue-600 text-4xl mb-3 block">📊</span>
                <h3 className="text-2xl font-bold text-blue-800 mb-1">{reviewStats.total}</h3>
                <p className="text-blue-700 text-sm">Всего отзывов</p>
              </div>

              <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
                <span className="text-yellow-600 text-4xl mb-3 block">⭐</span>
                <h3 className="text-2xl font-bold text-yellow-800 mb-1">{reviewStats.averageRating.toFixed(1)}</h3>
                <p className="text-yellow-700 text-sm">Средний рейтинг</p>
              </div>

              <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                <span className="text-green-600 text-4xl mb-3 block">👍</span>
                <h3 className="text-2xl font-bold text-green-800 mb-1">
                  {((reviewStats.ratingCounts[5] || 0) / reviewStats.total * 100).toFixed(0)}%
                </h3>
                <p className="text-green-700 text-sm">Отличных оценок</p>
              </div>

              <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                <span className="text-purple-600 text-4xl mb-3 block">🔄</span>
                <h3 className="text-2xl font-bold text-purple-800 mb-1">98%</h3>
                <p className="text-purple-700 text-sm">Повторных клиентов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Фильтры */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <span className="text-icambio-primary text-2xl mr-3">🔍</span>
              <h2 className="text-xl font-semibold text-icambio-primary">Фильтр по рейтингу</h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleRatingFilter(null)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedRating === null
                    ? 'bg-icambio-primary text-white border-icambio-primary'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Все отзывы ({processedReviews.length})
              </button>
              
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(rating)}
                  className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                    selectedRating === rating
                      ? 'bg-icambio-primary text-white border-icambio-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {renderStars(rating, 'sm')}
                  <span>({reviewStats.ratingCounts[rating] || 0})</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Сетка отзывов */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icambio-primary text-3xl mr-3">💬</span>
              <h2 className="text-2xl font-semibold text-icambio-primary">
                {selectedRating 
                  ? `Отзывы с рейтингом ${selectedRating} ${selectedRating === 1 ? 'звезда' : selectedRating < 5 ? 'звезды' : 'звезд'}`
                  : 'Все отзывы'
                }
              </h2>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-gray-400 text-6xl mb-4 block">😔</span>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Отзывов не найдено</h3>
                <p className="text-gray-500">Попробуйте изменить фильтр или сбросить его</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentReviews.map((review) => (
                    <Card
                      key={review.id}
                      className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex items-start mb-4">
                          <div className="w-12 h-12 rounded-full bg-icambio-primary/10 flex items-center justify-center mr-4">
                            <span className="text-icambio-primary font-bold text-xl">
                              {review.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{review.name}</h4>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                          {renderStars(review.rating, 'md')}
                        </div>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">
                          {review.comment.length > 100
                            ? `${review.comment.substring(0, 100)}...`
                            : review.comment}
                        </p>
                        <Modal>
                          <ModalTrigger asChild>
                            <button className="text-sm text-icambio-primary hover:underline self-start">
                              Читать полностью
                            </button>
                          </ModalTrigger>
                          <ModalContent>
                            <ModalHeader>
                              <ModalTitle>Отзыв от {review.name}</ModalTitle>
                              <div className="flex items-center justify-between pt-2">
                                {renderStars(review.rating, 'lg')}
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </ModalHeader>
                            <div className="py-4 text-base text-gray-700 leading-relaxed">
                              {review.comment}
                            </div>
                          </ModalContent>
                        </Modal>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Пагинация */}
                {renderPagination()}

                {/* Информация о пагинации */}
                <div className="text-center text-gray-500 text-sm mt-4">
                  Показано {startIndex + 1}-{Math.min(startIndex + REVIEWS_PER_PAGE, filteredReviews.length)} из {filteredReviews.length} отзывов
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Призыв оставить отзыв */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="bg-gradient-to-r from-icambio-primary to-blue-600 rounded-lg p-8 text-center text-white">
              <span className="text-4xl mb-4 block">✍️</span>
              <h2 className="text-2xl font-semibold mb-4">Поделитесь своим опытом</h2>
              <p className="mb-6 opacity-90">
                Ваш отзыв поможет другим клиентам сделать правильный выбор и поможет нам стать лучше!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/profile" 
                  className="bg-white text-icambio-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Оставить отзыв
                </a>
                <a 
                  href="https://yandex.ru/maps/org/icambio" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-icambio-primary transition-colors"
                >
                  Отзыв на Яндекс.Картах
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 