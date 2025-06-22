import { useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { authService, type LoginCredentials, type RegisterCredentials } from '../services/authService'
import toast from 'react-hot-toast'
import type { TUser, SupabaseSession } from '@/types'

export const useAuth = () => {
  const { user, session, isAuthenticated, isLoading, setAuth, setLoading, logout: logoutStore } = useAuthStore()

  // Инициализация состояния авторизации при загрузке приложения
  useEffect(() => {
    let isMounted = true; // Флаг для предотвращения обновления состояния после размонтирования
    
    const initializeAuth = async () => {
      try {
        setLoading(true)
        
        // Увеличиваем таймаут до 10 секунд и делаем его более умным
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Auth initialization timeout')), 10000)
        })
        
        // Получаем текущую сессию и данные пользователя
        const result = await Promise.race([
          authService.refreshSession(),
          timeoutPromise
        ]) as Awaited<ReturnType<typeof authService.refreshSession>>
        
        // Проверяем, что компонент ещё смонтирован
        if (!isMounted) {
          return
        }
        
        if (result.user && result.session) {
          setAuth(result.user as TUser, result.session as SupabaseSession)
        } else {
          setAuth(null, null)
        }
      } catch (error) {
        // Только сбрасываем состояние если компонент ещё смонтирован
        if (isMounted) {
          setAuth(null, null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Запускаем инициализацию только один раз
    initializeAuth()

    // Cleanup функция
    return () => {
      isMounted = false
    }

    // Временно отключаем подписку на изменения состояния для тестирования
    
    // const {
    //   data: { subscription },
    // } = supabase.auth.onAuthStateChange(async (event, session) => {
    //   if (session && session.user) {
    //     // При изменении состояния, создаём пользователя из данных сессии
    //     const user: TUser = {
    //       ...session.user,
    //       id: session.user.id,
    //       email: session.user.email || '',
    //       username: session.user.user_metadata?.username || undefined,
    //       first_name: session.user.user_metadata?.first_name || undefined,
    //       last_name: session.user.user_metadata?.last_name || undefined,
    //       whatsapp: session.user.user_metadata?.whatsapp || undefined,
    //       telegram: session.user.user_metadata?.telegram || undefined,
    //       referral_link: undefined,
    //       referralBalance: undefined,
    //     };
    //     setAuth(user, session as SupabaseSession)
    //   } else {
    //     setAuth(null, null)
    //   }
      
    //   setLoading(false)
    // })

    // return () => subscription.unsubscribe()
    
  }, []) // Убираем зависимости, чтобы useEffect выполнялся только один раз

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

      // Для Supabase с подтверждением email
      if (result.user && !result.session) {
        setAuth(result.user, null) // Устанавливаем пользователя, но без сессии
        toast.success('Регистрация прошла успешно! Проверьте email для подтверждения.')
        return { success: true, needsConfirmation: true }
      }

      if (result.user && result.session) {
        setAuth(result.user, result.session)
        toast.success('Успешная регистрация!')
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
    updateProfile: authService.updateProfile,
  }
}
