import api from '@/shared/api/api';
import { ExchangeRate } from '@/features/exchange/types';

export const exchangeAPI = {
  getRates: () => api.get<ExchangeRate[]>('/exchange/rates'),

  createOrder: (data: { fromCurrency: string; toCurrency: string; amount: number }) =>
    api.post('/exchange/orders', data),
};
