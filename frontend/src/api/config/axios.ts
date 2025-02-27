// frontend/src/api/config/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from '@/constants/api';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { getToken } from '@/services/authService';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Функция для установки токена в заголовках запросов
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Инициализация токена при старте
const token = getToken();
if (token) {
  setAuthToken(token);
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Получаем токен из Redux store или localStorage
    const token = store.getState().auth.token || getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;