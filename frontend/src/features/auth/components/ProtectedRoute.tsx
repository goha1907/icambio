import * as React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Loader } from '@/shared/ui/Loader';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';

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
 * ProtectedRoute — компонент-обёртка для защищённых маршрутов.
 *
 * Выполняет две основные проверки перед рендерингом вложенных маршрутов (`<Outlet />`):
 * 1. Пользователь аутентифицирован (`useAuth().isAuthenticated`).
 * 2. Пользователь обладает хотя бы одной из требуемых ролей (`user.roles`).
 *
 * При отсутствии аутентификации происходит редирект на страницу логина. Если же
 * аутентификация прошла, но роли не совпадают, отображается страница "Доступ
 * запрещён" (можно заменить через `accessDeniedComponent`).
 *
 * @param {ProtectedRouteProps}  props                                   Параметры компонента
 * @param {string}               [props.redirectTo="/login"]           URL для редиректа неавторизованных пользователей
 * @param {string[]}             [props.requiredRoles]                   Список ролей, необходимых для доступа. Роли читаются из `user.roles`
 * @param {React.ReactNode}      [props.fallback]                        Кастомный элемент для состояния загрузки
 * @param {React.ReactNode}      [props.accessDeniedComponent]           Кастомный элемент для отображения ошибки доступа
 * @param {string}               [props.className]                       Дополнительные CSS-классы контейнера состояний
 * @param {boolean}              [props.showDetailedErrors=false]        Показывать ли подробности о требуемых/текущих ролях
 * @returns {JSX.Element} Компонент `<Outlet />`, либо состояние загрузки, либо редирект/отказ в доступе
 *
 * @example
 * // 1. Базовое использование (только проверка аутентификации)
 * <ProtectedRoute />
 *
 * @example
 * // 2. Кастомный путь редиректа
 * <ProtectedRoute redirectTo="/auth/signin" />
 *
 * @example
 * // 3. Проверка ролей пользователя
 * <ProtectedRoute 
 *   requiredRoles={['admin', 'moderator']}
 *   accessDeniedComponent={<CustomAccessDenied />}
 * />
 *
 * @example
 * // 4. Кастомное состояние загрузки
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
    // Получаем роли пользователя (предполагаем, что они есть в user.roles)
    const userRoles = user?.roles || [];
    
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
