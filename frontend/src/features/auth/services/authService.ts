// Ключи для хранения данных в localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Сохранение токена и пользователя
export const saveAuthData = (token: string, user: any) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Получение токена
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Получение сохраненного пользователя
export const getUser = (): any | null => {
  const userData = localStorage.getItem(USER_KEY);
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error('Error parsing user data from localStorage:', e);
      return null;
    }
  }
  return null;
};

// Очистка данных аутентификации
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Проверка аутентификации
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
