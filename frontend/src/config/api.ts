// Базовый URL в зависимости от окружения
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/jwt/create/',
    register: '/auth/users/',
    resetPassword: '/auth/users/reset_password/',
    profile: '/auth/users/me/',
    activate: '/auth/users/activation/', // добавляем endpoint для активации
    resendActivation: '/auth/users/resend_activation/', // для повторной отправки активации
  },
  exchange: {
    rates: '/v1/rates/',
    orders: '/v1/orders/',
  },
} as const;

// Типы для эндпоинтов
export type ApiEndpoints = typeof API_ENDPOINTS;
