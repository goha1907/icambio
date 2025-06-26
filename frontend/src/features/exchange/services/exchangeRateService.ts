import api from '@/shared/api/api';
import { ExchangeRate } from '@/features/exchange/types';
import { API_CONFIG } from '@/config/api';
import { MOCK_EXCHANGE_RATES, mockCalculationResult, delay, shouldSimulateError } from '@/lib/mock-data';

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

export const exchangeRateService = {
  getAllExchangeRates: async (): Promise<ExchangeRate[]> => {
    // В режиме разработки используем моки
    if (API_CONFIG.isDevelopment && API_CONFIG.development.useMocks) {
      // Имитируем задержку API
      await delay(API_CONFIG.development.mockDelay);
      
      // Имитируем случайные ошибки
      if (shouldSimulateError(API_CONFIG.development.mockErrorRate)) {
        throw new Error('Ошибка загрузки курсов обмена (мок)');
      }
      
      return MOCK_EXCHANGE_RATES;
    }
    
    // В продакшене используем реальный API
    const response = await api.get<ExchangeRate[]>('/rates/');
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
      
      // Простой расчет на основе входных данных
      const calculatedResult = {
        ...mockCalculationResult,
        amount_from: data.amount_from || mockCalculationResult.amount_from,
        amount_to: data.amount_to || mockCalculationResult.amount_to,
      };
      
      // Если передана сумма источника, пересчитываем результат
      if (data.amount_from) {
        calculatedResult.amount_to = data.amount_from * mockCalculationResult.rate;
      }
      
      return calculatedResult;
    }
    
    // В продакшене используем реальный API
    const response = await api.post<CalculateExchangeResult>(
      `/rates/${rateId}/calculate/`,
      data
    );
    return response.data;
  },
}; 