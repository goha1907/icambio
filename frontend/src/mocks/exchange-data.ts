import { Currency, ExchangeRate } from '@/types';

export const mockCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: 'US$', type: 'fiat', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', type: 'fiat', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', type: 'fiat', decimals: 2 },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto', decimals: 8 },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto', decimals: 6 },
  { code: 'USDT', name: 'Tether', symbol: '₮', type: 'crypto', decimals: 6 },
  { code: 'ARS', name: 'ARS', symbol: '$', type: 'fiat', decimals: 2 },

];

export const mockExchangeRates: ExchangeRate[] = [
  { id: 1, fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.85, minAmount: 100 },
  { id: 2, fromCurrency: 'USD', toCurrency: 'RUB', rate: 89.00, minAmount: 100 },
  { id: 3, fromCurrency: 'EUR', toCurrency: 'USD', rate: 1.18, minAmount: 100 },
  { id: 4, fromCurrency: 'EUR', toCurrency: 'RUB', rate: 90.00, minAmount: 100 },
  { id: 5, fromCurrency: 'RUB', toCurrency: 'USD', rate: 0.013, minAmount: 10000 },
  { id: 6, fromCurrency: 'RUB', toCurrency: 'EUR', rate: 0.011, minAmount: 10000 },
  { id: 7, fromCurrency: 'BTC', toCurrency: 'USD', rate: 80000, minAmount: 0.001 },
  { id: 8, fromCurrency: 'ETH', toCurrency: 'USD', rate: 2450, minAmount: 0.01 },
  { id: 9, fromCurrency: 'USDT', toCurrency: 'USD', rate: 0.971, minAmount: 100 },
  { id: 10, fromCurrency: 'USD', toCurrency: 'USDT', rate: 1.00, minAmount: 100 },
  { id: 11, fromCurrency: 'USDT', toCurrency: 'ARS', rate: 1155, minAmount: 100 },
  { id: 12, fromCurrency: 'USDT', toCurrency: 'ARS', rate: 1165, minAmount: 500 },
];

export const mockReviews = [
  {
    id: 1,
    username: 'Алексей',
    text: 'Очень быстрый и удобный обмен. Менял BTC на рубли, всё прошло за несколько минут.',
    rating: 5,
    date: '2024-01-15',
  },
  {
    id: 2,
    username: 'Елена',
    text: 'Хорошие курсы и оперативная поддержка. Была небольшая заминка, но всё быстро решили.',
    rating: 4,
    date: '2024-01-10',
  },
  {
    id: 3,
    username: 'Максим',
    text: 'Пользуюсь уже не первый раз. Всегда всё чётко и без проблем.',
    rating: 5,
    date: '2024-01-05',
  },
];

// Функция для получения курса обмена между двумя валютами
export const getExchangeRate = (fromCurrency: string, toCurrency: string): number | null => {
  if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
    return null;
  }
  
  const rateObj = mockExchangeRates.find(
    rate => rate.fromCurrency === fromCurrency && rate.toCurrency === toCurrency
  );
  
  if (rateObj) {
    return rateObj.rate;
  }
  
  // Если прямой курс не найден, попробуем найти обратный и инвертировать его
  const reverseRateObj = mockExchangeRates.find(
    rate => rate.fromCurrency === toCurrency && rate.toCurrency === fromCurrency
  );
  
  if (reverseRateObj) {
    return 1 / reverseRateObj.rate;
  }
  
  // Если ни прямого, ни обратного курса нет, попробуем найти через USD
  const rateToUSD = fromCurrency === 'USD' ? 1 : getExchangeRate(fromCurrency, 'USD');
  const rateFromUSD = toCurrency === 'USD' ? 1 : getExchangeRate('USD', toCurrency);
  
  if (rateToUSD && rateFromUSD) {
    return rateToUSD * rateFromUSD;
  }
  
  return null;
};

// Функция для получения минимальной суммы обмена
export const getMinAmount = (fromCurrency: string, toCurrency: string): number => {
  const rateObj = mockExchangeRates.find(
    rate => rate.fromCurrency === fromCurrency && rate.toCurrency === toCurrency
  );
  
  if (rateObj) {
    return rateObj.minAmount;
  }
  
  // Если пара не найдена, вернем значение по умолчанию
  return 100;
};

// Функция для расчета суммы к получению
export const calculateToAmount = (fromCurrency: string, toCurrency: string, fromAmount: number): number | null => {
  const rate = getExchangeRate(fromCurrency, toCurrency);
  if (rate === null || fromAmount <= 0) {
    return null;
  }
  
  const toAmount = fromAmount * rate;
  
  // Округляем до нужного количества знаков после запятой в зависимости от валюты
  const toCurrencyObj = mockCurrencies.find(currency => currency.code === toCurrency);
  if (toCurrencyObj) {
    return Number(toAmount.toFixed(toCurrencyObj.decimals));
  }
  
  return toAmount;
};

// Функция для расчета суммы к отправке
export const calculateFromAmount = (fromCurrency: string, toCurrency: string, toAmount: number): number | null => {
  const rate = getExchangeRate(fromCurrency, toCurrency);
  if (rate === null || toAmount <= 0) {
    return null;
  }
  
  const fromAmount = toAmount / rate;
  
  // Округляем до нужного количества знаков после запятой в зависимости от валюты
  const fromCurrencyObj = mockCurrencies.find(currency => currency.code === fromCurrency);
  if (fromCurrencyObj) {
    return Number(fromAmount.toFixed(fromCurrencyObj.decimals));
  }
  
  return fromAmount;
};