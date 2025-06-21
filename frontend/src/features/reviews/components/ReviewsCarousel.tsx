import { Review } from '@/types';

interface ReviewsCarouselProps {
  reviews: Review[];
}

export const ReviewsCarousel = ({ reviews }: ReviewsCarouselProps) => {
  return (
    <div className="reviews-carousel bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="review-card p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{review.display_name}</h3>
                <p className="text-sm text-gray-500">{review.created_at}</p>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 text-gray-600">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 