import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit, Lock, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { TUser } from '@/types';

interface UserMenuProps {
  user: TUser;
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'profile', label: 'Профиль', icon: User, path: '/profile' },
    { id: 'edit', label: 'Редактировать профиль', icon: Edit, path: '/profile/edit' },
    { id: 'password', label: 'Сменить пароль', icon: Lock, path: '/change-password' },
  ];

  const handleLogout = () => {
    void logout();
    navigate('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary font-medium">
            {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700">{user.username || user.email}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50
                      border border-gray-100 transform origin-top-right transition-all duration-200">
          {menuItems.map(({ id, label, icon: Icon, path }) => (
            <button
              key={id}
              onClick={() => {
                navigate(path);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 
                       flex items-center space-x-2 transition-colors duration-200"
            >
              <Icon className="w-4 h-4 text-gray-500" />
              <span>{label}</span>
            </button>
          ))}

          <div className="border-t border-gray-100 my-1" />

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 
                     flex items-center space-x-2 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Выйти</span>
          </button>
        </div>
      )}
    </div>
  );
};
