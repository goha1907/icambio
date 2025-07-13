import api from '@/shared/api/api';
import { ExchangeRate, ExchangeRateDB } from '@/features/exchange/types';
import { API_CONFIG } from '@/shared/config/api';
import { 
  MOCK_EXCHANGE_RATES_DB, 
  MOCK_CURRENCIES_DB,
  getExchangeRatesForPair,
  getFilterExchangeRates,
  delay, 
  shouldSimulateError 
} from '@/shared/lib/mock-data-db';

interface CalculateExchangeData {
  amount_from?: number;
  amount_to?: number;
}

interface CalculateExchangeResult {
  from_currency: string;
  to_currency: string;
  amount_from: number;
  amount_to: number;
  rate: number;
  min_amount: number;
}

// Функция для преобразования ExchangeRateDB в ExchangeRate (для совместимости)
const transformExchangeRateDBToExchangeRate = (rateDB: ExchangeRateDB): ExchangeRate => {
  const fromCurrency = MOCK_CURRENCIES_DB.find(c => c.id === rateDB.currency_from_id);
  const toCurrency = MOCK_CURRENCIES_DB.find(c => c.id === rateDB.currency_to_id);
  
  if (!fromCurrency || !toCurrency) {
    throw new Error(`Не найдены валюты для курса ${rateDB.id}`);
  }

  return {
    id: rateDB.id,
    from_currency: {
      code: fromCurrency.code,
      name: fromCurrency.name,
      symbol: fromCurrency.symbol,
      decimal_digits: fromCurrency.decimal_places,
      is_crypto: fromCurrency.code === 'USDT' || fromCurrency.code === 'BTC' || fromCurrency.code === 'ETH'
    },
    to_currency: {
      code: toCurrency.code,
      name: toCurrency.name,
      symbol: toCurrency.symbol,
      decimal_digits: toCurrency.decimal_places,
      is_crypto: toCurrency.code === 'USDT' || toCurrency.code === 'BTC' || toCurrency.code === 'ETH'
    },
    rate: rateDB.rate,
    minAmount: rateDB.min_amount,
    maxAmount: rateDB.max_amount || undefined,
    is_hot: rateDB.is_hot
  };
};

export const exchangeRateService = {
  // Получить все курсы обмена (совместимый интерфейс)
  getAllExchangeRates: async (): Promise<ExchangeRate[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      // Имитируем задержку API
      await delay(API_CONFIG.development.mockDelay);
      
      // Имитируем случайные ошибки
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка загрузки курсов обмена (мок)');
      }
      
      // Преобразуем новые данные в старый формат для совместимости
      return MOCK_EXCHANGE_RATES_DB
        .filter(rate => rate.visible) // Только видимые курсы
        .map(transformExchangeRateDBToExchangeRate);
    }
    
    // В продакшене используем реальный API
    const response = await api.get<ExchangeRate[]>('/rates/');
    return response.data;
  },

  // Новый метод для получения курсов в формате БД
  getAllExchangeRatesDB: async (): Promise<ExchangeRateDB[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка загрузки курсов обмена (мок)');
      }
      
      return MOCK_EXCHANGE_RATES_DB.filter(rate => rate.visible);
    }
    
    // В продакшене используем реальный API
    const response = await api.get<ExchangeRateDB[]>('/rates/');
    return response.data;
  },

  // Получить курсы для пары валют
  getExchangeRatesForPair: async (
    fromCurrencyId: number, 
    toCurrencyId: number, 
    branchId: number = 1
  ): Promise<ExchangeRateDB[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка загрузки курсов для пары валют (мок)');
      }
      
      return getExchangeRatesForPair(fromCurrencyId, toCurrencyId, branchId);
    }
    
    // В продакшене используем реальный API
    const response = await api.get<ExchangeRateDB[]>(
      `/rates/pair/${fromCurrencyId}/${toCurrencyId}/?branch_id=${branchId}`
    );
    return response.data;
  },

  // Получить курсы для фильтров
  getFilterExchangeRates: async (branchId: number = 1): Promise<ExchangeRateDB[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка загрузки курсов для фильтров (мок)');
      }
      
      return getFilterExchangeRates(branchId);
    }
    
    // В продакшене используем реальный API
    const response = await api.get<ExchangeRateDB[]>(`/rates/filter/?branch_id=${branchId}`);
    return response.data;
  },

  // Получить подходящий курс для суммы
  getRateForAmount: async (
    fromCurrencyId: number,
    toCurrencyId: number,
    amount: number,
    branchId: number = 1
  ): Promise<ExchangeRateDB | null> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка поиска курса для суммы (мок)');
      }
      
      const rates = getExchangeRatesForPair(fromCurrencyId, toCurrencyId, branchId);
      // Находим подходящий курс по сумме
      return rates.find(rate => 
        amount >= rate.min_amount && 
        (rate.max_amount === null || amount <= rate.max_amount)
      ) || null;
    }
    
    // В продакшене используем реальный API
    const response = await api.get<ExchangeRateDB>(
      `/rates/for-amount/${fromCurrencyId}/${toCurrencyId}/${amount}/?branch_id=${branchId}`
    );
    return response.data;
  },

  calculateExchange: async (
    rateId: string,
    data: CalculateExchangeData
  ): Promise<CalculateExchangeResult> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      // Имитируем задержку API
      await delay(500); // Более короткая задержка для калькулятора
      
      // Имитируем случайные ошибки
      if (shouldSimulateError(0.05)) { // Меньше ошибок для калькулятора
        throw new Error('Ошибка расчета обмена (мок)');
      }
      
      // Находим курс по ID
      const rate = MOCK_EXCHANGE_RATES_DB.find(r => r.id.toString() === rateId);
      if (!rate) {
        throw new Error('Курс не найден');
      }

      const fromCurrency = MOCK_CURRENCIES_DB.find(c => c.id === rate.currency_from_id);
      const toCurrency = MOCK_CURRENCIES_DB.find(c => c.id === rate.currency_to_id);
      
      if (!fromCurrency || !toCurrency) {
        throw new Error('Валюты не найдены');
      }

      // Простой расчет на основе курса
      const amount_from = data.amount_from || 1000;
      const amount_to = amount_from * rate.rate;
      
      return {
        from_currency: fromCurrency.code,
        to_currency: toCurrency.code,
        amount_from,
        amount_to,
        rate: rate.rate,
        min_amount: rate.min_amount
      };
    }
    
    // В продакшене используем реальный API
    const response = await api.post<CalculateExchangeResult>(
      `/rates/${rateId}/calculate/`,
      data
    );
    return response.data;
  },
}; 