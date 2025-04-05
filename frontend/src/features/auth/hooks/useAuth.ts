import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api/services/auth';
import { saveAuthData, clearAuthData, getAuthData, isAuthenticated as checkAuth } from '../services/authService';
import { useNotification } from '@/lib/hooks/useNotification';
import { LoginCredentials, RegisterData } from '@/types';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { user } = getAuthData();
  const isAuthenticated = checkAuth();

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);
      saveAuthData(response.token, response.user);
      success('Вы успешно вошли в систему');
      navigate('/');
    } catch (err) {
      error('Ошибка входа: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register({
        ...data,
        re_password: data.password,
      });
      saveAuthData(response.token, response.user);
      success('Регистрация успешно завершена');
      navigate('/');
    } catch (err) {
      error('Ошибка регистрации: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
      clearAuthData();
      success('Вы успешно вышли из системы');
      navigate('/login');
    } catch (err) {
      error('Ошибка выхода: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    isLoading,
    user,
    isAuthenticated,
  };
}
