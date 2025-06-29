import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Edit, Lock, LogOut, Users } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { TUser } from '@/types';

interface UserMenuProps {
  user: TUser;
}

/**
 * Компонент меню пользователя
 * 
 * Отображает выпадающее меню с профилем пользователя и действиями.
 * Автоматически скрывается при клике вне меню или потере фокуса.
 * Подсвечивает активный пункт меню в зависимости от текущей страницы.
 * 
 * @example
 * <UserMenu user={currentUser} />
 */
export const UserMenu = ({ user }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Автоскрытие меню при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Обработка клавиш для доступности
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Профиль', icon: User, path: '/profile' },
    { id: 'password', label: 'Сменить пароль', icon: Lock, path: '/change-password' },
  ];

  // Проверка активного пункта меню
  const isActiveMenuItem = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    void logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={menuRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        onClick={toggleMenu}
        onBlur={(e) => {
          // Проверяем, что фокус не переходит на элемент внутри меню
          if (!menuRef.current?.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
          }
        }}
        className="flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm ring-offset-background transition-all duration-200 ease-in-out hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-icmop-primary focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-icmop-primary/10 rounded-full flex items-center justify-center">
            <span className="text-icmop-primary font-medium">
              {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground">{user.username || user.email}</span>
        </div>
        <svg
          className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border bg-white text-foreground shadow-lg
                    data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                    data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-1">
            {menuItems.map(({ id, label, icon: Icon, path }) => {
              const isActive = isActiveMenuItem(path);
              return (
                <button
                  key={id}
                  onClick={() => handleMenuItemClick(path)}
                  onBlur={(e) => {
                    // Проверяем, что фокус не переходит на другой элемент меню
                    if (!menuRef.current?.contains(e.relatedTarget as Node)) {
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    // Базовые стили для пункта меню (как SelectItem)
                    "relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none transition-colors duration-150",
                    // Состояния наведения и фокуса
                    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    // Активное состояние (как выбранный SelectItem)
                    isActive && "bg-icmop-primary/10 text-icmop-primary font-medium"
                  )}
                  role="menuitem"
                >
                  {/* Иконка индикатора активного элемента */}
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isActive && (
                      <div className="h-2 w-2 rounded-full bg-icmop-primary" />
                    )}
                  </span>

                  {/* Иконка и текст пункта меню */}
                  <Icon className={cn(
                    "w-4 h-4 mr-2",
                    isActive ? "text-icmop-primary" : "text-gray-500"
                  )} />
                  <span>{label}</span>
                </button>
              );
            })}

            {/* Разделитель */}
            <div className="-mx-1 my-1 h-px bg-border" />

            <button
              onClick={handleLogout}
              onBlur={(e) => {
                // Проверяем, что фокус не переходит на другой элемент меню
                if (!menuRef.current?.contains(e.relatedTarget as Node)) {
                  setIsOpen(false);
                }
              }}
              className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none transition-colors duration-150
                       hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 text-red-600"
              role="menuitem"
            >
              {/* Пустое место для индикатора (для выравнивания) */}
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center" />
              
              <LogOut className="w-4 h-4 mr-2" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
