import api from '@/shared/api/api';
import { Review } from '@/types';
import { API_CONFIG } from '@/config/api';
import { MOCK_REVIEWS, delay, shouldSimulateError } from '@/lib/mock-data';

export const reviewService = {
  getAllReviews: async (): Promise<Review[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      // Имитируем задержку API
      await delay(API_CONFIG.development.mockDelay);
      
      // Имитируем случайные ошибки
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка загрузки отзывов (мок)');
      }
      
      return MOCK_REVIEWS;
    }
    
    // В продакшене используем реальный API
    const response = await api.get<Review[]>('/reviews/list_public/');
    return response.data;
  },
}; 