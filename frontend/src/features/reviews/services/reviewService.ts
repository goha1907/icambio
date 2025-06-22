import api from '@/shared/api/api';
import { Review } from '@/types';

export const reviewService = {
  getAllReviews: async (): Promise<Review[]> => {
    const response = await api.get<Review[]>('/reviews/list_public/');
    return response.data;
  },
}; 