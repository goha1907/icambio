import api from '@/shared/api/api';
import { Currency } from '@/types';

export const currencyService = {
  getAllCurrencies: async (): Promise<Currency[]> => {
    const response = await api.get<Currency[]>('/v1/currencies/');
    return response.data;
  },
}; 