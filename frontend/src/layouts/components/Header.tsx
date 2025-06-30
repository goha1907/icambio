import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserMenu } from '@/features/profile/components/UserMenu';
import { Logo } from '@/shared/ui/Logo';
import { Button } from '@/shared/ui/Button';
import { useState } from 'react';

export const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Главная' },
    { path: '/delivery', label: 'Доставка' },
    { path: '/working-hours', label: 'График работы' },
    { path: '/reviews', label: 'Отзывы' },
    { path: '/about', label: 'О нас' },
  ];

  const isActive = (path: string) => {
    const isCurrentPath = path === '/' 
      ? location.pathname === path 
      : location.pathname.startsWith(path);
      
    return isCurrentPath
      ? 'text-icmop-primary border-b-2 border-icmop-primary font-medium px-3 py-2 text-sm sm:text-base rounded-md transition-all duration-200'
      : 'text-gray-600 hover:text-icmop-primary transition-colors duration-200 px-3 py-2 text-sm sm:text-base rounded-md hover:bg-gray-50';
  };

  const isAuthPage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur-sm transition-all duration-300 ease-in-out shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-24 items-center justify-between">
          {/* Левая часть - Логотип и навигация */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Logo size="lg" />
            </div>

            {/* Десктопная навигация */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map(item => (
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

          {/* Правая часть - Авторизация */}
          <div className="flex items-center space-x-4">
            {/* Авторизация */}
            {isAuthenticated && user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm"
                  className={isAuthPage('/login') ? 'ring-2 ring-icmop-primary ring-offset-2' : ''}
                >
                  <Link to="/login">
                    Вход
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="sm"
                  className={`bg-icmop-primary hover:bg-icmop-primary/90 ${isAuthPage('/register') ? 'ring-2 ring-icmop-primary ring-offset-2' : ''}`}
                >
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
              {menuItems.map(item => (
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
          </div>
        </div>
      )}
    </header>
  );
};
