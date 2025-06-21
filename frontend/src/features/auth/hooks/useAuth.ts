import { useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { authService, type LoginCredentials, type RegisterCredentials } from '../services/authService'
import { supabase } from '@/config/supabase'
import toast from 'react-hot-toast'
import type { TUser, SupabaseSession } from '@/types'

export const useAuth = () => {
  const { user, session, isAuthenticated, isLoading, setAuth, setLoading, logout: logoutStore } = useAuthStore()

  // Инициализация состояния авторизации при загрузке приложения
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        
        // Получаем текущую сессию и данные пользователя
        const { user, session } = await authService.refreshSession()
        
        if (user && session) {
          setAuth(user as TUser, session as SupabaseSession) // Приводим типы явно
        } else {
          setAuth(null, null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setAuth(null, null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Подписываемся на изменения состояния авторизации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)
      
      if (session && session.user) {
        // При изменении состояния, также обновляем данные профиля
        const { user: refreshedUser, session: refreshedSession } = await authService.refreshSession()
        if (refreshedUser && refreshedSession) {
          setAuth(refreshedUser as TUser, refreshedSession as SupabaseSession) // Приводим типы явно
        } else {
          setAuth(null, null)
        }
      } else {
        setAuth(null, null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setAuth, setLoading])

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      const result = await authService.login(credentials)
      
      if (result.error) {
        toast.error(result.error)
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
        toast.error(result.error)
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
        toast.error(result.error)
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
