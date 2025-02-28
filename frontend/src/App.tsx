import { useEffect } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '@/features/auth/store/authSlice';
import { routes } from '@/config/routes';
import { getToken } from '@/features/auth/services/authService';
import { Toaster } from 'react-hot-toast';
import type { AppDispatch } from '@/store';

// Компонент для рендеринга маршрутов
const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();

  // При загрузке приложения проверяем аутентификацию
  useEffect(() => {
    // Если есть токен, получаем данные пользователя
    if (getToken()) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  const element = useRoutes(routes);
  return element;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
