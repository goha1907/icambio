// import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { ExchangeCalculator } from '@/features/home/components/ExchangeCalculator';
import { ExchangeRatesTable } from '@/features/exchange/components/ExchangeRatesTable';
import { ReviewsCarousel } from '@/features/home/components/ReviewsCarousel';
// Удаляем импорты хуков
// import { useCurrencies, useExchangeRates } from '@/features/exchange/hooks/useExchangeRate';
// import { useReviews } from '@/features/reviews/hooks/useReviews';

export const HomePage = () => {
  const navigate = useNavigate();

  // Удаляем все хуки и состояния
  // const { data: currencies, isLoading: isLoadingCurrencies, isError: isErrorCurrencies } = useCurrencies();
  // ...

  return (
    <div className="page-content">
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-3">
          {/* Упрощаем, просто рендерим калькулятор */}
          <ExchangeCalculator />
        </div>
      </div>

      {/* Exchange Rates */}
      <div className="mb-12">
        {/* Упрощаем, просто рендерим таблицу */}
        <ExchangeRatesTable />
      </div>

      {/* Reviews */}
      <div className="mb-12">
        {/* Упрощаем, просто рендерим карусель */}
        <ReviewsCarousel />
      </div>

      {/* Delivery Info */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out p-6 sm:p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Доставка</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-green-500 text-2xl mr-2">💸</span>
              <h3 className="text-xl font-semibold">БЕСПЛАТНО</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Минимальная сумма заказа для бесплатной доставки варьируется в зависимости от района.
            </p>
            <div className="flex items-center">
              <span className="text-blue-500 text-2xl mr-2">📍</span>
              <h3 className="text-xl font-semibold">Зоны доставки</h3>
            </div>
          </div>
          <div>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 text-2xl mr-2">⚠️</span>
              <h3 className="text-xl font-semibold">Важно!</h3>
            </div>
            <p className="text-gray-600 font-semibold">
              Все сделки ТОЛЬКО при личной встрече
            </p>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out p-6 sm:p-8 mb-12">
        <div className="flex items-center mb-6">
          <span className="text-blue-500 text-2xl mr-2">🕒</span>
          <h2 className="text-2xl font-bold">График работы:</h2>
        </div>
        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold">Будни:</span> с 9:00 до 17:00
          </p>
          <p className="text-lg">
            <span className="font-semibold">Суббота и праздничные дни:</span> с 9:00 до 15:00
          </p>
          <p className="text-lg">
            <span className="font-semibold">Воскресенье:</span>{' '}
            <span className="text-red-500 font-bold">ВЫХОДНОЙ</span> ❗
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-icmop-background to-white/90 backdrop-blur-sm rounded-xl shadow-[0_4px_20px_-4px_rgba(0,166,81,0.1)] hover:shadow-[0_4px_24px_-4px_rgba(0,166,81,0.15)] transition-all duration-300 ease-in-out p-6 sm:p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Готовы к обмену?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Создайте заказ сейчас и получите лучший курс для вашего обмена.
        </p>
        <Button 
          className="btn-primary text-lg px-8 py-3" 
          onClick={() => navigate('/exchange')}
        >
          Заказать обмен
        </Button>
      </div>
    </div>
  );
};