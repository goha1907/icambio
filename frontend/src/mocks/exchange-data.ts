import { Currency, ExchangeRate } from '@/types';

export const mockCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', type: 'fiat', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', type: 'fiat', decimals: 2 },
  { code: 'USDT', name: 'Tether', symbol: '₮', type: 'crypto', decimals: 2 },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', type: 'fiat', decimals: 2 },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', type: 'fiat', decimals: 2 },
];

export const mockExchangeRates: ExchangeRate[] = [
  // USD -> ARS
  { id: 1, fromCurrency: 'USD', toCurrency: 'ARS', rate: 1270, minAmount: 0, maxAmount: 500 },
  { id: 2, fromCurrency: 'USD', toCurrency: 'ARS', rate: 1280, minAmount: 500 },
  
  // USDT -> ARS
  { id: 3, fromCurrency: 'USDT', toCurrency: 'ARS', rate: 1250, minAmount: 0, maxAmount: 500 },
  { id: 4, fromCurrency: 'USDT', toCurrency: 'ARS', rate: 1260, minAmount: 500 },
  
  // EUR -> ARS
  { id: 5, fromCurrency: 'EUR', toCurrency: 'ARS', rate: 1330, minAmount: 0, maxAmount: 500 },
  { id: 6, fromCurrency: 'EUR', toCurrency: 'ARS', rate: 1340, minAmount: 500 },
  
  // RUB -> ARS
  { id: 7, fromCurrency: 'RUB', toCurrency: 'ARS', rate: 13.6, minAmount: 10000 },
  
  // USD -> USDT
  { id: 8, fromCurrency: 'USD', toCurrency: 'USDT', rate: 1, minAmount: 100 },
  
  // USDT -> USD (до 3500)
  { id: 9, fromCurrency: 'USDT', toCurrency: 'USD', rate: 0.971, minAmount: 0, maxAmount: 3500 },
  
  // USDT -> USD (от 3500)
  { id: 10, fromCurrency: 'USDT', toCurrency: 'USD', rate: 0.981, minAmount: 3500 },
  
  // KZT -> ARS
  { id: 11, fromCurrency: 'KZT', toCurrency: 'ARS', rate: 2.37, minAmount: 10000 },
  
  // RUB -> USD
  { id: 12, fromCurrency: 'RUB', toCurrency: 'USD', rate: 0.0108, minAmount: 92.5 },
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

// Функция для получения курса обмена между двумя валютами с учетом суммы
export const getExchangeRate = (fromCurrency: string, toCurrency: string, amount: number = 0): number | null => {
  if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
    return null;
  }
  
  // Ищем все курсы для данной пары валют
  const rates = mockExchangeRates.filter(
    rate => rate.fromCurrency === fromCurrency && rate.toCurrency === toCurrency
  );
  
  if (rates.length > 0) {
    // Находим подходящий курс по сумме
    const rate = rates.find(r => 
      amount >= r.minAmount && 
      (!r.maxAmount || amount <= r.maxAmount)
    );
    
    if (rate) {
      return rate.rate;
    }
  }
  
  // Если прямой курс не найден, попробуем найти обратный и инвертировать его
  const reverseRates = mockExchangeRates.filter(
    rate => rate.fromCurrency === toCurrency && rate.toCurrency === fromCurrency
  );
  
  if (reverseRates.length > 0) {
    const reverseRate = reverseRates.find(r => 
      amount >= r.minAmount && 
      (!r.maxAmount || amount <= r.maxAmount)
    );
    
    if (reverseRate) {
      return 1 / reverseRate.rate;
    }
  }
  
  return null;
};

// Функция для получения минимальной суммы обмена
export const getMinAmount = (fromCurrency: string, toCurrency: string): number => {
  const rates = mockExchangeRates.filter(
    rate => rate.fromCurrency === fromCurrency && rate.toCurrency === toCurrency
  );
  
  if (rates.length > 0) {
    // Возвращаем минимальную сумму из всех курсов для данной пары
    return Math.min(...rates.map(r => r.minAmount));
  }
  
  return 100; // Значение по умолчанию
};

// Функция для расчета суммы к получению
export const calculateToAmount = (fromCurrency: string, toCurrency: string, fromAmount: number): number | null => {
  const rate = getExchangeRate(fromCurrency, toCurrency, fromAmount);
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
  // Для обратного расчета нам нужно подобрать правильный курс
  // Попробуем несколько диапазонов сумм
  const possibleAmounts = [0, 100, 500, 1000, 3500, 10000];
  
  for (const amount of possibleAmounts) {
    const rate = getExchangeRate(fromCurrency, toCurrency, amount);
    if (rate !== null) {
      const calculatedFromAmount = toAmount / rate;
      
      // Проверяем, подходит ли рассчитанная сумма под этот курс
      const finalRate = getExchangeRate(fromCurrency, toCurrency, calculatedFromAmount);
      if (finalRate === rate) {
        // Округляем до нужного количества знаков после запятой
        const fromCurrencyObj = mockCurrencies.find(currency => currency.code === fromCurrency);
        if (fromCurrencyObj) {
          return Number(calculatedFromAmount.toFixed(fromCurrencyObj.decimals));
        }
        return calculatedFromAmount;
      }
    }
  }
  
  return null;
};