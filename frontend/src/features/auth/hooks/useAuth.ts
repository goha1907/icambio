import { useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { authService, type LoginCredentials, type RegisterCredentials } from '../services/authService'
import toast from 'react-hot-toast'
import type { TUser, SupabaseSession } from '@/types'
import { supabase } from '@/config/supabase'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const { user, session, isAuthenticated, isLoading, setAuth, setLoading, logout: logoutStore } = useAuthStore()
  const navigate = useNavigate()

  // Добавляем дебаг информацию
  console.log('useAuth state:', { 
    user: user?.email, 
    isAuthenticated, 
    isLoading,
    hasSession: !!session 
  });

  // Инициализация состояния авторизации при загрузке приложения
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      console.log('useAuth: Starting auth initialization...');
      
      try {
        // Сначала проверяем текущую сессию из Supabase
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        console.log('useAuth: Current session check:', { hasSession: !!currentSession, error });
        
        if (error) {
          console.log('useAuth: Session error, clearing auth');
          setAuth(null, null);
        } else if (currentSession && currentSession.user) {
          console.log('useAuth: Found valid session, setting user');
          const user: TUser = {
            ...currentSession.user,
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            username: currentSession.user.user_metadata?.username || undefined,
            first_name: currentSession.user.user_metadata?.first_name || undefined,
            last_name: currentSession.user.user_metadata?.last_name || undefined,
            whatsapp: currentSession.user.user_metadata?.whatsapp || undefined,
            telegram: currentSession.user.user_metadata?.telegram || undefined,
            referral_link: undefined,
            referralBalance: undefined,
          };
          setAuth(user, currentSession as SupabaseSession);
        } else {
          console.log('useAuth: No valid session, clearing auth');
          setAuth(null, null);
        }
      } catch (error) {
        console.log('useAuth: Auth initialization error:', error);
        if (isMounted) {
          setAuth(null, null);
        }
      } finally {
        if (isMounted) {
          console.log('useAuth: Setting loading to false');
          setLoading(false);
        }
      }
    };

    // Запускаем инициализацию
    initializeAuth();

    // Подписка на изменения состояния аутентификации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('useAuth: Auth state change:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session && session.user) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlType = urlParams.get('type');
        
        // Проверяем тип события
        if (urlType === 'recovery') {
          console.log('useAuth: Password recovery signin, redirecting to set-new-password');
          navigate('/set-new-password');
          return;
        }

        // Создаем пользователя из сессии
        const user: TUser = {
          ...session.user,
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username || undefined,
          first_name: session.user.user_metadata?.first_name || undefined,
          last_name: session.user.user_metadata?.last_name || undefined,
          whatsapp: session.user.user_metadata?.whatsapp || undefined,
          telegram: session.user.user_metadata?.telegram || undefined,
          referral_link: undefined,
          referralBalance: undefined,
        };
        
        console.log('useAuth: Setting user from auth state change');
        setAuth(user, session as SupabaseSession);

        // Стандартная Supabase логика - если подтверждение email, сразу авторизуем и перенаправляем на главную
        if (urlType === 'signup') {
          toast.success('Email подтвержден! Добро пожаловать!');
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('useAuth: User signed out');
        setAuth(null, null);
      }
    });

    // Cleanup функция
    return () => {
      console.log('useAuth: Cleaning up...');
      isMounted = false;
      subscription.unsubscribe();
    }
    
  }, [setAuth, setLoading, navigate])

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      const result = await authService.login(credentials)
      
      if (result.error) {
        toast.error((result.error as any).message || String(result.error))
        return { success: false, error: result.error }
      }

      if (result.user && result.session) {
        setAuth(result.user, result.session)
        toast.success('Успешный вход в систему!')
        return { success: true }
      }

      return { success: false, error: 'Неизвестная ошибка' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [setAuth, setLoading])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setLoading(true)
      const result = await authService.register(credentials)
      
      if (result.error) {
        toast.error((result.error as any).message || String(result.error))
        return { success: false, error: result.error }
      }

      // Для Supabase с подтверждением email - всегда считаем что нужно подтверждение
      if (result.user) {
        // НЕ устанавливаем auth состояние, так как пользователь должен сначала подтвердить email
        toast.success('Регистрация прошла успешно! Проверьте email для подтверждения.')
        return { success: true, needsConfirmation: true }
      }

      return { success: false, error: 'Неизвестная ошибка' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [setLoading])

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      const result = await authService.logout()
      
      if (result.error) {
        toast.error((result.error as any).message || String(result.error))
        return { success: false, error: result.error }
      }

      logoutStore()
      toast.success('Вы вышли из системы')
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [logoutStore, setLoading])

  const getAccessToken = useCallback((): string | null => {
    return session?.access_token || null
  }, [session])

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    resetPassword: authService.resetPassword,
    getAccessToken,
    changePassword: authService.changePassword,
    changePasswordWithReauth: authService.changePasswordWithReauth,
    updateProfile: authService.updateProfile,
  }
}
