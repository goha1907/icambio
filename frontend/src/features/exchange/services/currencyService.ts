import api from '@/shared/api/api';
import { Currency } from '@/features/exchange/types';
import { API_CONFIG } from '@/config/api';
import { MOCK_CURRENCIES, delay, shouldSimulateError } from '@/lib/mock-data';

export const currencyService = {
  getAllCurrencies: async (): Promise<Currency[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      // Имитируем задержку API
      await delay(API_CONFIG.development.mockDelay);
      
      // Имитируем случайные ошибки
      if (shouldSimulateError()) {
        throw new Error('Ошибка загрузки валют (мок)');
      }
      
      return MOCK_CURRENCIES;
    }
    
    // В продакшене используем реальный API
    const response = await api.get<Currency[]>('/currencies/');
    return response.data;
  },
}; 