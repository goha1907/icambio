// frontend/src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ExchangeCalculator } from '@/components/exchange/ExchangeCalculator';
import { ExchangeRatesTable } from '@/components/exchange/ExchangeRatesTable';
import { ReviewsCarousel } from '@/components/reviews/ReviewsCarousel';
import type { Currency, ExchangeRate } from '@/types';

// Демо-данные для примера
const dummyCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', type: 'fiat', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', type: 'fiat', decimals: 2 },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto', decimals: 8 },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto', decimals: 6 },
  { code: 'USDT', name: 'Tether', symbol: '₮', type: 'crypto', decimals: 6 }
];

// В типе ExchangeRate нет поля updatedAt, поэтому создаем тип для демо-данных
interface DemoExchangeRate extends ExchangeRate {
  updatedAt: string;
}

const dummyRates: DemoExchangeRate[] = [
  { id: 1, fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.85, minAmount: 10, updatedAt: new Date().toISOString() },
  { id: 2, fromCurrency: 'USD', toCurrency: 'RUB', rate: 75.5, minAmount: 10, updatedAt: new Date().toISOString() },
  { id: 3, fromCurrency: 'EUR', toCurrency: 'USD', rate: 1.18, minAmount: 10, updatedAt: new Date().toISOString() },
  { id: 4, fromCurrency: 'EUR', toCurrency: 'RUB', rate: 89.2, minAmount: 10, updatedAt: new Date().toISOString() },
  { id: 5, fromCurrency: 'RUB', toCurrency: 'USD', rate: 0.013, minAmount: 1000, updatedAt: new Date().toISOString() },
  { id: 6, fromCurrency: 'RUB', toCurrency: 'EUR', rate: 0.011, minAmount: 1000, updatedAt: new Date().toISOString() },
  { id: 7, fromCurrency: 'BTC', toCurrency: 'USD', rate: 38500, minAmount: 0.001, updatedAt: new Date().toISOString() },
  { id: 8, fromCurrency: 'ETH', toCurrency: 'USD', rate: 2450, minAmount: 0.01, updatedAt: new Date().toISOString() },
  { id: 9, fromCurrency: 'USDT', toCurrency: 'USD', rate: 1, minAmount: 10, updatedAt: new Date().toISOString() }
];

const dummyReviews = [
  {
    id: 1,
    username: 'Алексей',
    text: 'Очень быстрый и удобный обмен. Менял BTC на рубли, всё прошло за несколько минут.',
    rating: 5,
    date: '2024-01-15'
  },
  {
    id: 2,
    username: 'Елена',
    text: 'Хорошие курсы и оперативная поддержка. Была небольшая заминка, но всё быстро решили.',
    rating: 4,
    date: '2024-01-10'
  },
  {
    id: 3,
    username: 'Максим',
    text: 'Пользуюсь уже не первый раз. Всегда всё чётко и без проблем.',
    rating: 5,
    date: '2024-01-05'
  },
  {
    id: 4,
    username: 'Ольга',
    text: 'Отличный сервис! Понравилась возможность заказать доставку наличных.',
    rating: 5,
    date: '2023-12-28'
  },
  {
    id: 5,
    username: 'Дмитрий',
    text: 'Удобный интерфейс. Легко разобраться даже новичку.',
    rating: 4,
    date: '2023-12-23'
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  
  const handleCreateOrder = () => {
    navigate('/exchange');
  };

  return (
    <div className="page-content">
      {/* Hero Section */}
      <section className="py-12 px- md:py-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Быстрый и надежный обмен валют</h1>
          <p className="text-xl mb-8">Выгодные курсы, мгновенные операции и безопасные переводы.</p>
          {/* <Button 
            variant="primary" 
            className="bg-white text-blue-700 hover:bg-gray-100 text-lg px-8 py-3"
            onClick={handleCreateOrder}
          >
            Начать обмен
          </Button> */}
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Рассчитайте обмен</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <ExchangeCalculator 
              currencies={dummyCurrencies} 
              onCreateOrder={handleCreateOrder}
            />
          </div>
        </div>
      </div>

      {/* Exchange Rates */}
      <div className="mb-12">
        <ExchangeRatesTable rates={dummyRates} currencies={dummyCurrencies} />
      </div>

      {/* Reviews */}
      <div className="mb-12">
        <ReviewsCarousel reviews={dummyReviews} />
      </div>

      {/* Call to Action */}
      <div className="bg-gray-100 rounded-lg p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Готовы к обмену?</h2>
        <p className="text-lg text-gray-600 mb-6">Создайте заказ сейчас и получите лучший курс для вашего обмена.</p>
        <Button 
          variant="primary" 
          className="text-lg px-8 py-3"
          onClick={handleCreateOrder}
        >
          Заказать обмен
        </Button>
      </div>
    </div>
  );
};