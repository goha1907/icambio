import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
}

export const ProtectedRoute = ({ isAuthenticated }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// Новый компонент для использования в маршрутах
export const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();



  // Принудительный сброс loading через 3 секунды
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {

        // Если все еще загружается через 3 секунды, считаем что не авторизован
        window.location.href = '/login';
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {

    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return <Outlet />;
};
