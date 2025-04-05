import { User } from '@/types';

// Ключи для хранения данных в localStorage
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

// Сохранение токена и пользователя
export function saveAuthData(token: string, user: User): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Получение токена
export function getAuthData(): { token: string | null; user: User | null } {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  const user = userStr ? JSON.parse(userStr) as User : null;
  return { token, user };
}

// Получение только токена
export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Очистка данных аутентификации
export function clearAuthData(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Проверка аутентификации
export function isAuthenticated(): boolean {
  return !!getAuthData().token;
}
