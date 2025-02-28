import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { isAuthenticated as checkLocalStorage } from '@/features/auth/services/authService';

export const useAuth = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Проверяем и Redux state, и localStorage для более надежной работы
  const isAuth = isAuthenticated || checkLocalStorage();

  return {
    user,
    isAuthenticated: isAuth,
  };
};
