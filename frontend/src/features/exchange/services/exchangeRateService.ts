import api from '@/shared/api/api';
import { ExchangeRate } from '@/types';

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
    const response = await api.get<ExchangeRate[]>('/v1/rates/');
    return response.data;
  },

  calculateExchange: async (
    rateId: string,
    data: CalculateExchangeData
  ): Promise<CalculateExchangeResult> => {
    const response = await api.post<CalculateExchangeResult>(
      `/v1/rates/${rateId}/calculate/`,
      data
    );
    return response.data;
  },
}; 