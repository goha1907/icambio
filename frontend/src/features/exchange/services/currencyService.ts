import api from '@/shared/api/api';
import { Currency } from '@/features/exchange/types';

export const currencyService = {
  getAllCurrencies: async (): Promise<Currency[]> => {
    const response = await api.get<Currency[]>('/currencies/');
    return response.data;
  },
}; 