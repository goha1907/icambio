import api from '@/shared/api/api';
import { Currency, CurrencyDB } from '@/features/exchange/types';
import { API_CONFIG } from '@/shared/config/api';
import { MOCK_CURRENCIES_DB, delay, shouldSimulateError } from '@/shared/lib/mock-data-db';

// Функция для преобразования CurrencyDB в Currency (для совместимости)
const transformCurrencyDBToCurrency = (currencyDB: CurrencyDB): Currency => ({
  code: currencyDB.code,
  name: currencyDB.name,
  symbol: currencyDB.symbol,
  decimal_digits: currencyDB.decimal_places,
  is_crypto: currencyDB.code === 'USDT' || currencyDB.code === 'BTC' || currencyDB.code === 'ETH' // Простая логика определения криптовалют
});

export const currencyService = {
  // Получить все валюты (совместимый интерфейс)
  getAllCurrencies: async (): Promise<Currency[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      // Имитируем задержку API
      await delay(API_CONFIG.development.mockDelay);
      
      // Имитируем случайные ошибки
      if (shouldSimulateError()) {
        throw new Error('Ошибка загрузки валют (мок)');
      }
      
      // Преобразуем новые данные в старый формат для совместимости
      return MOCK_CURRENCIES_DB.map(transformCurrencyDBToCurrency);
    }
    
    // В продакшене используем реальный API
    const response = await api.get<Currency[]>('/currencies/');
    return response.data;
  },

  // Новый метод для получения валют в формате БД
  getAllCurrenciesDB: async (): Promise<CurrencyDB[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      // Имитируем задержку API
      await delay(API_CONFIG.development.mockDelay);
      
      // Имитируем случайные ошибки
      if (shouldSimulateError()) {
        throw new Error('Ошибка загрузки валют (мок)');
      }
      
      return MOCK_CURRENCIES_DB;
    }
    
    // В продакшене используем реальный API
    const response = await api.get<CurrencyDB[]>('/currencies/');
    return response.data;
  },

  // Получить валюту по ID
  getCurrencyById: async (id: number): Promise<CurrencyDB | null> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError()) {
        throw new Error('Ошибка загрузки валюты (мок)');
      }
      
      return MOCK_CURRENCIES_DB.find(c => c.id === id) || null;
    }
    
    // В продакшене используем реальный API
    const response = await api.get<CurrencyDB>(`/currencies/${id}/`);
    return response.data;
  },

  // Получить валюту по коду
  getCurrencyByCode: async (code: string): Promise<CurrencyDB | null> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      await delay(API_CONFIG.development.mockDelay);
      
      if (shouldSimulateError()) {
        throw new Error('Ошибка загрузки валюты (мок)');
      }
      
      return MOCK_CURRENCIES_DB.find(c => c.code === code) || null;
    }
    
    // В продакшене используем реальный API
    const response = await api.get<CurrencyDB>(`/currencies/by-code/${code}/`);
    return response.data;
  }
}; 