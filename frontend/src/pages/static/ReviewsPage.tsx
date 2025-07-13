import { useState, useMemo } from 'react';
import { Star, Filter, User } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select';
import { MOCK_REVIEWS_DB, MOCK_USERS_DB } from '@/shared/lib/mock-data-db';

export const ReviewsPage = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  // Преобразуем данные из моков в нужный формат
  const processedReviews = useMemo(() => {
    return MOCK_REVIEWS_DB.map(review => {
      const user = MOCK_USERS_DB.find(u => u.id === review.user_id);
      return {
        ...review,
        name: user ? `${user.first_name} ${user.last_name}` : 'Пользователь',
        user: {
          id: review.user_id,
          name: user?.first_name || 'Пользователь',
          lastname: user?.last_name || ''
        }
      };
    });
  }, []);

  // Фильтруем отзывы по рейтингу
  const filteredReviews = useMemo(() => {
    if (selectedRating === null) {
      return processedReviews;
    }
    return processedReviews.filter(review => review.rating === selectedRating);
  }, [selectedRating, processedReviews]);

  // Пагинация
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // Статистика
  const total = filteredReviews.length;
  const ratingCounts = processedReviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const averageRating = processedReviews.length > 0 ?
    processedReviews.reduce((sum, review) => sum + review.rating, 0) / processedReviews.length : 0;

  const handleRatingFilter = (rating: string) => {
    setSelectedRating(rating === 'all' ? null : parseInt(rating));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Отзывы наших клиентов
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Узнайте, что говорят о нас клиенты, которые уже воспользовались нашими услугами
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-icambio-primary mb-2">
              {total}
            </div>
            <div className="text-gray-600">Всего отзывов</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-icambio-primary mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-gray-600">Средний рейтинг</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-icambio-primary mb-2">
              {ratingCounts[5] || 0}
            </div>
            <div className="text-gray-600">5 звезд</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-icambio-primary mb-2">
              {Math.round((ratingCounts[5] || 0) / total * 100)}%
            </div>
            <div className="text-gray-600">Довольных клиентов</div>
          </Card>
        </div>

        {/* Фильтры */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Фильтр:</span>
          </div>
          <Select value={selectedRating?.toString() || 'all'} onValueChange={handleRatingFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Все рейтинги" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все рейтинги</SelectItem>
              <SelectItem value="5">5 звезд</SelectItem>
              <SelectItem value="4">4 звезды</SelectItem>
              <SelectItem value="3">3 звезды</SelectItem>
              <SelectItem value="2">2 звезды</SelectItem>
              <SelectItem value="1">1 звезда</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Список отзывов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-icambio-primary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </Card>
          ))}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Назад
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "primary" : "outline"}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Вперед
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}; 