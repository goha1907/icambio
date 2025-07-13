import api from '@/shared/api/api';
import { Review } from '@/types';
import { ReviewDB } from '@/features/exchange/types';
import { API_CONFIG } from '@/shared/config/api';
import { 
  MOCK_REVIEWS_DB, 
  MOCK_USERS_DB,
  getVisibleReviews,
  delay, 
  shouldSimulateError 
} from '@/shared/lib/mock-data-db';

// Функция для преобразования ReviewDB в Review (для совместимости)
const transformReviewDBToReview = (reviewDB: ReviewDB): Review => {
  const user = MOCK_USERS_DB.find(u => u.id === reviewDB.user_id);
  
  if (!user) {
    throw new Error(`Пользователь не найден для отзыва ${reviewDB.id}`);
  }

  return {
    id: reviewDB.id.toString(),
    user: {
      id: user.id,
      name: user.first_name,
      lastname: user.last_name
    },
    rating: reviewDB.rating,
    comment: reviewDB.comment,
    created_at: reviewDB.created_at
  };
};

export const reviewService = {
  // Получить все отзывы (совместимый интерфейс)
  getAllReviews: async (): Promise<Review[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      // Имитируем задержку API
      await delay(API_CONFIG.development.mockDelay);
      
      // Имитируем случайные ошибки
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка загрузки отзывов (мок)');
      }
      
      // Преобразуем новые данные в старый формат для совместимости
      return getVisibleReviews().map(transformReviewDBToReview);
    }
    
    // В продакшене используем реальный API
    const response = await api.get<Review[]>('/reviews/list_public/');
    return response.data;
  },

  // Новый метод для получения отзывов в формате БД
  getAllReviewsDB: async (): Promise<ReviewDB[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка загрузки отзывов (мок)');
      }
      
      return getVisibleReviews();
    }
    
    // В продакшене используем реальный API
    const response = await api.get<ReviewDB[]>('/reviews/');
    return response.data;
  },

  // Получить отзывы пользователя
  getReviewsByUserId: async (userId: string): Promise<ReviewDB[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка загрузки отзывов пользователя (мок)');
      }
      
      return MOCK_REVIEWS_DB.filter(review => review.user_id === userId);
    }
    
    // В продакшене используем реальный API
    const response = await api.get<ReviewDB[]>(`/reviews/user/${userId}/`);
    return response.data;
  },

  // Получить отзыв по ID
  getReviewById: async (reviewId: number): Promise<ReviewDB | null> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка загрузки отзыва (мок)');
      }
      
      return MOCK_REVIEWS_DB.find(review => review.id === reviewId) || null;
    }
    
    // В продакшене используем реальный API
    const response = await api.get<ReviewDB>(`/reviews/${reviewId}/`);
    return response.data;
  },

  // Создать новый отзыв
  createReview: async (reviewData: {
    user_id: string;
    order_id: string;
    rating: number;
    comment: string;
  }): Promise<ReviewDB> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка создания отзыва (мок)');
      }
      
      // Проверяем, что пользователь существует
      const user = MOCK_USERS_DB.find(u => u.id === reviewData.user_id);
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      
      // Проверяем, что отзыв для этого заказа еще не существует
      const existingReview = MOCK_REVIEWS_DB.find(
        r => r.user_id === reviewData.user_id && r.order_id === reviewData.order_id
      );
      if (existingReview) {
        throw new Error('Отзыв для этого заказа уже существует');
      }
      
      // Создаем новый отзыв
      const newReview: ReviewDB = {
        id: Math.max(...MOCK_REVIEWS_DB.map(r => r.id)) + 1,
        user_id: reviewData.user_id,
        order_id: reviewData.order_id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        visible: false, // По умолчанию невидимый, пока не одобрен модератором
        created_at: new Date().toISOString()
      };
      
      // В реальном приложении здесь был бы вызов API для сохранения
      // MOCK_REVIEWS_DB.push(newReview);
      
      return newReview;
    }
    
    // В продакшене используем реальный API
    const response = await api.post<ReviewDB>('/reviews/', reviewData);
    return response.data;
  },

  // Обновить отзыв
  updateReview: async (
    reviewId: number, 
    updateData: Partial<Pick<ReviewDB, 'rating' | 'comment' | 'visible'>>
  ): Promise<ReviewDB> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка обновления отзыва (мок)');
      }
      
      const review = MOCK_REVIEWS_DB.find(r => r.id === reviewId);
      if (!review) {
        throw new Error('Отзыв не найден');
      }
      
      // Обновляем отзыв
      const updatedReview: ReviewDB = {
        ...review,
        ...updateData
      };
      
      // В реальном приложении здесь был бы вызов API для обновления
      // const index = MOCK_REVIEWS_DB.findIndex(r => r.id === reviewId);
      // MOCK_REVIEWS_DB[index] = updatedReview;
      
      return updatedReview;
    }
    
    // В продакшене используем реальный API
    const response = await api.patch<ReviewDB>(`/reviews/${reviewId}/`, updateData);
    return response.data;
  }
}; 