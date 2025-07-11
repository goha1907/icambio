// Конфигурация API
export const API_CONFIG = {
  // Режим разработки (будет использовать моки)
  isDevelopment: import.meta.env.DEV,
  
  // Базовый URL в зависимости от окружения
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  
  // Настройки для режима разработки
  development: {
    useMocks: true,
    mockDelay: 1000, // Задержка для имитации реального API
    mockErrorRate: 0.1, // 10% шанс ошибки
  },
} as const;

// Устаревший экспорт для обратной совместимости
export const BASE_URL = API_CONFIG.baseUrl;

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/jwt/create/',
    register: '/auth/users/',
    logout: '/auth/jwt/logout/',
    resetPassword: '/auth/users/reset_password/',
    profile: '/auth/users/me/',
    activate: '/auth/users/activation/', // добавляем endpoint для активации
    resendActivation: '/auth/users/resend_activation/', // для повторной отправки активации
  },
  exchange: {
    currencies: '/currencies/',
    rates: '/rates/',
    calculate: '/rates/calculate/',
    orders: '/orders/',
  },
  reviews: {
    list: '/reviews/list_public/',
  },
} as const;

// Типы для эндпоинтов
export type ApiEndpoints = typeof API_ENDPOINTS;
