import { useCallback, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { authService } from '../services/authService'
import type { LoginCredentials, RegisterData, TUser } from '@/types'

export const useAuth = () => {
  const {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,
    setAuth,
    setLoading,
    setError,
    logout: logoutStore,
    updateTokens,
  } = useAuthStore()

  // Инициализация состояния аутентификации при загрузке приложения
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Если есть токены, проверяем их валидность
        if (tokens?.access) {
          const result = await authService.getCurrentUser()
          if (result.user) {
            setAuth(result.user, tokens)
          } else {
            // Токен недействителен, очищаем состояние
            logoutStore()
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        logoutStore()
      } finally {
        setLoading(false)
      }
    }

    if (isLoading) {
      initializeAuth()
    }
  }, [tokens, isLoading, setAuth, setLoading, logoutStore])

  // Логин
  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true)
    try {
      const result = await authService.login(credentials)
      if (result.user && result.tokens) {
        setAuth(result.user, result.tokens)
        return { success: true }
      }
      setError(result.error || 'Ошибка входа')
      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }, [setAuth, setLoading, setError])

  // Регистрация
  const register = useCallback(async (credentials: RegisterData) => {
    setLoading(true)
    try {
      const result = await authService.register(credentials)
      if (result.user && result.tokens) {
        setAuth(result.user, result.tokens)
        return { success: true }
      }
      setError(result.error || 'Ошибка регистрации')
      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }, [setAuth, setLoading, setError])

  // Логаут
  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await authService.logout()
      logoutStore()
      return { success: true }
    } finally {
      setLoading(false)
    }
  }, [logoutStore, setLoading])

  // Обновление токенов
  const refreshTokens = useCallback(async () => {
    setLoading(true)
    try {
      const result = await authService.refreshTokens()
      if (result.tokens) {
        updateTokens(result.tokens)
        setAuth(result.user, result.tokens)
        return { success: true }
      }
      setError(result.error || 'Ошибка обновления токенов')
      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }, [setAuth, setLoading, setError, updateTokens])

  // Сброс пароля
  const resetPassword = useCallback(async (email: string) => {
    setLoading(true)
    try {
      const result = await authService.resetPassword(email)
      if (!result.error) {
        return { success: true }
      }
      setError(result.error)
      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Смена пароля
  const changePassword = useCallback(async (newPassword: string) => {
    setLoading(true)
    try {
      const result = await authService.changePassword(newPassword)
      if (!result.error) {
        return { success: true }
      }
      setError(result.error)
      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Обновление профиля
  const updateProfile = useCallback(async (updates: Partial<TUser>) => {
    setLoading(true)
    try {
      const result = await authService.updateProfile(updates)
      if (!result.error) {
        // Можно обновить пользователя через getCurrentUser, если нужно
        return { success: true }
      }
      setError(result.error)
      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshTokens,
    resetPassword,
    changePassword,
    updateProfile,
  }
}
