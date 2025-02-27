// frontend/src/api/services/exchange.ts
import api from '@/api/config/axios';
import { ExchangeRate } from '@/types';

export const exchangeAPI = {
  getRates: () => api.get<ExchangeRate[]>('/exchange/rates'),

  createOrder: (data: { fromCurrency: string; toCurrency: string; amount: number }) =>
    api.post('/exchange/orders', data),
};
