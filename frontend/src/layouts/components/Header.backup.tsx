import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserMenu } from '@/features/profile/components/UserMenu';
import { Logo } from '@/shared/ui/Logo';
import { Button } from '@/shared/ui/Button';
import { useState } from 'react';
import { Phone, Clock, Plus } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Главная' },
    { path: '/exchange', label: 'Обменник' },
    { path: '/profile', label: 'Профиль', authRequired: true },
  ];

  const isActive = (path: string) => {
    const isCurrentPath = path === '/' 
      ? location.pathname === path 
      : location.pathname.startsWith(path);
      
    return isCurrentPath
      ? 'text-icmop-primary border-b-2 border-icmop-primary font-medium px-3 py-2 text-sm sm:text-base rounded-md transition-all duration-200'
      : 'text-gray-600 hover:text-icmop-primary transition-colors duration-200 px-3 py-2 text-sm sm:text-base rounded-md hover:bg-gray-50';
  };

  // Фильтруем пункты меню в зависимости от статуса авторизации
  const visibleMenuItems = menuItems.filter(item => 
    !item.authRequired || (item.authRequired && isAuthenticated)
  );

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur-sm transition-all duration-300 ease-in-out shadow-sm">
      {/* Верхняя полоса с контактами - только на десктопе */}
      <div className="hidden lg:block bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+7 999 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Пн-Пт: 9:00-17:00, Сб: 9:00-15:00</span>
              </div>
            </div>
            <div className="text-gray-500">
              Быстрый и безопасный обмен валют
            </div>
          </div>
        </div>
      </div>

      {/* Основной хедер */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Левая часть - Логотип и навигация */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Logo size="sm" />
            </div>

            {/* Десктопная навигация */}
            <nav className="hidden lg:flex items-center space-x-1">
              {visibleMenuItems.map(item => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={isActive(item.path)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Правая часть - CTA и авторизация */}
          <div className="flex items-center space-x-4">
            {/* Кнопка создания заявки - скрыта на мобильных */}
            <div className="hidden sm:block">
              <Button 
                asChild
                size="sm"
                className="bg-icmop-primary hover:bg-icmop-primary/90"
              >
                <Link to="/exchange">
                  <Plus className="w-4 h-4 mr-2" />
                  Создать заявку
                </Link>
              </Button>
            </div>

            {/* Авторизация */}
            {isAuthenticated && user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-icmop-primary transition-colors duration-200 text-sm font-medium"
                >
                  Вход
                </Link>
                <Button asChild size="sm" variant="outline">
                  <Link to="/register">
                    Регистрация
                  </Link>
                </Button>
              </div>
            )}

            {/* Кнопка мобильного меню */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Открыть меню"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Навигация */}
            <nav className="space-y-2">
              {visibleMenuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-icmop-primary hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA кнопка для мобильных */}
            <div className="pt-2 border-t">
              <Button 
                asChild
                className="w-full bg-icmop-primary hover:bg-icmop-primary/90"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/exchange">
                  <Plus className="w-4 h-4 mr-2" />
                  Создать заявку
                </Link>
              </Button>
            </div>

            {/* Контакты для мобильных */}
            <div className="pt-2 border-t space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+7 999 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Пн-Пт: 9:00-17:00, Сб: 9:00-15:00</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
