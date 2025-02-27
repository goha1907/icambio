// frontend/src/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { isAuthenticated as checkLocalStorage } from '@/services/authService';

export const useAuth = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Проверяем и Redux state, и localStorage для более надежной работы
  const isAuth = isAuthenticated || checkLocalStorage();
  
  return { 
    user, 
    isAuthenticated: isAuth
  };
};