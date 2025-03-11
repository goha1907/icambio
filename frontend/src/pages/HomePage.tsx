import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { ExchangeCalculator } from '@/features/home/components/ExchangeCalculator';
import { ExchangeRatesTable } from '@/features/exchange/components/ExchangeRatesTable';
import { ReviewsCarousel } from '@/features/home/components/ReviewsCarousel';
import { mockCurrencies, mockExchangeRates, mockReviews } from '@/mocks/exchange-data';

export const HomePage = () => {
  const navigate = useNavigate();

  // Мемоизация данных для предотвращения ненужных перерисовок
  const currencies = useMemo(() => mockCurrencies, []);
  const rates = useMemo(() => mockExchangeRates, []);
  const reviews = useMemo(() => mockReviews, []);

  // Мемоизация обработчика
  const handleCreateOrder = useMemo(() => () => {
    navigate('/exchange');
  }, [navigate]);

  return (
    <div className="page-content">
      {/* Hero Section */}
      <section className="py-12 px- md:py-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Быстрый и надежный обмен валют
          </h1>
          <p className="text-xl mb-8">Выгодные курсы, мгновенные операции и безопасные переводы.</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Рассчитайте обмен</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <ExchangeCalculator 
              currencies={currencies} 
              onCreateOrder={handleCreateOrder} 
            />
          </div>
        </div>
      </div>

      {/* Exchange Rates */}
      <div className="mb-12">
        <ExchangeRatesTable rates={rates} currencies={currencies} />
      </div>

      {/* Reviews */}
      <div className="mb-12">
        <ReviewsCarousel reviews={reviews} />
      </div>

      {/* Call to Action */}
      <div className="bg-gray-100 rounded-lg p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Готовы к обмену?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Создайте заказ сейчас и получите лучший курс для вашего обмена.
        </p>
        <Button variant="primary" className="text-lg px-8 py-3" onClick={handleCreateOrder}>
          Заказать обмен
        </Button>
      </div>
    </div>
  );
};