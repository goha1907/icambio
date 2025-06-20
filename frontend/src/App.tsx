import { useEffect } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from '@/config/routes';
import { getToken } from '@/features/auth/services/authService';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Компонент для рендеринга маршрутов
const AppRoutes = () => {
  useAuth(); // Инициализация хука аутентификации

  // При загрузке приложения проверяем аутентификацию
  useEffect(() => {
    // Если есть токен, получаем данные пользователя
    // Здесь можно инициировать проверку токена или запрос текущего пользователя при необходимости
    // Пока логика вынесена в кастомный хук useAuth или обрабатывается на уровне компонентов
    void getToken();
  }, []);

  const element = useRoutes(routes);
  return element;
};

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
