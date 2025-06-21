import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: reviewService.getAllReviews,
  });
}; 