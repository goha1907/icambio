import axiosInstance from './axios';

// Auth APIs
export const authAPI = {
  login: (data: any) => axiosInstance.post('/auth/login/', data),
  register: (data: any) => axiosInstance.post('/auth/register/', data),
  getProfile: () => axiosInstance.get('/auth/me/')
};

// Exchange APIs
export const exchangeAPI = {
  getBranches: () => axiosInstance.get('/exchange/branches/'),
  getRates: (branchId: number) => axiosInstance.get(`/exchange/rates/?branch=${branchId}`),
  calculateExchange: (data: any) => axiosInstance.post('/exchange/rates/calculate_exchange/', data)
};

// Orders APIs
export const ordersAPI = {
  createOrder: (data: any) => axiosInstance.post('/orders/', data),
  getOrders: () => axiosInstance.get('/orders/'),
  getOrder: (id: number) => axiosInstance.get(`/orders/${id}/`)
};