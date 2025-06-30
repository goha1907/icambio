import * as React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Loader } from './Loader';
import { Alert, AlertDescription, AlertTitle } from './Alert';
import { Button } from './Button';
import { cn } from '@/lib/utils';

/**
 * Интерфейс пропсов для компонента ProtectedRoute
 */
interface ProtectedRouteProps {
  /** Путь для редиректа неавторизованных пользователей (по умолчанию: "/login") */
  redirectTo?: string;
  /** Массив ролей, необходимых для доступа к маршруту */
  requiredRoles?: string[];
  /** Кастомный компонент для состояния загрузки */
  fallback?: React.ReactNode;
  /** Кастомный компонент для отображения ошибок доступа */
  accessDeniedComponent?: React.ReactNode;
  /** CSS классы для контейнера */
  className?: string;
  /** Показывать ли детализированные сообщения об ошибках */
  showDetailedErrors?: boolean;
}

/**
 * Компонент ProtectedRoute для защиты маршрутов, требующих аутентификации
 * 
 * Этот компонент проверяет аутентификацию пользователя и при необходимости
 * перенаправляет на страницу входа. Поддерживает проверку ролей, кастомные
 * редиректы и настраиваемые состояния загрузки.
 * 
 * @example
 * // Базовое использование - защита маршрута
 * <ProtectedRoute />
 * 
 * @example
 * // С кастомным редиректом
 * <ProtectedRoute redirectTo="/auth/signin" />
 * 
 * @example
 * // С проверкой ролей пользователя
 * <ProtectedRoute 
 *   requiredRoles={['admin', 'moderator']}
 *   accessDeniedComponent={<CustomAccessDenied />}
 * />
 * 
 * @example
 * // С кастомным состоянием загрузки
 * <ProtectedRoute 
 *   fallback={
 *     <div className="flex h-screen items-center justify-center">
 *       <Loader size="xl" showText loadingText="Проверка прав доступа..." />
 *     </div>
 *   }
 * />
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = '/login',
  requiredRoles = [],
  fallback,
  accessDeniedComponent,
  className,
  showDetailedErrors = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Состояние загрузки - показываем индикатор загрузки
  if (isLoading) {
    // Если передан кастомный fallback, используем его
    if (fallback) {
      return <>{fallback}</>;
    }

    // Стандартное состояние загрузки
    return (
      <div className={cn(
        'flex min-h-[50vh] items-center justify-center',
        className
      )}>
        <div className="text-center space-y-4">
          {/* Анимированный индикатор загрузки */}
          <div className="mx-auto">
            <Loader size="lg" />
          </div>
          {/* Текст состояния */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              Проверка авторизации...
            </p>
            <p className="text-sm text-muted-foreground">
              Пожалуйста, подождите
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Проверка аутентификации - если не авторизован, редиректим на страницу входа
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Проверка ролей пользователя (если указаны требуемые роли)
  if (requiredRoles.length > 0) {
    // Получаем роли пользователя (предполагаем, что они в user_metadata)
    const userRoles = user?.user_metadata?.roles || [];
    
    // Проверяем, есть ли у пользователя хотя бы одна из требуемых ролей
    const hasRequiredRole = requiredRoles.some(role => 
      userRoles.includes(role)
    );

    // Если нет необходимых ролей, показываем ошибку доступа
    if (!hasRequiredRole) {
      // Если передан кастомный компонент для ошибки доступа
      if (accessDeniedComponent) {
        return <>{accessDeniedComponent}</>;
      }

      // Стандартная страница отказа в доступе
      return (
        <div className={cn(
          'flex min-h-[50vh] items-center justify-center p-4',
          className
        )}>
          <div className="w-full max-w-md">
            <Alert variant="destructive">
              <AlertTitle>Доступ запрещен</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  У вас недостаточно прав для просмотра этой страницы.
                </p>
                {showDetailedErrors && (
                  <div className="text-xs space-y-1">
                    <p>Требуемые роли: {requiredRoles.join(', ')}</p>
                    <p>Ваши роли: {userRoles.length > 0 ? userRoles.join(', ') : 'отсутствуют'}</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
            
            {/* Кнопки действий */}
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex-1"
              >
                Назад
              </Button>
              <Button 
                variant="primary"
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                На главную
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Если все проверки пройдены, рендерим дочерние маршруты
  return <Outlet />;
};

export type { ProtectedRouteProps };
