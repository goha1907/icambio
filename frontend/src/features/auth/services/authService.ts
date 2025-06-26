import { supabase } from '@/config/supabase'
import type { SupabaseSession, TUser } from '@/types'
import { AuthError } from '@supabase/supabase-js'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export interface AuthResponse {
  user: TUser | null
  session: SupabaseSession | null
  error?: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials)

      if (error) {
        return { user: null, session: null, error: this.getErrorMessage(error.message) }
      }

      if (data.user && data.session) {
        const user: TUser = {
          ...data.user,
          id: data.user.id,
          email: data.user.email || '',
          username: data.user.user_metadata?.username || undefined,
          first_name: data.user.user_metadata?.first_name || undefined,
          last_name: data.user.user_metadata?.last_name || undefined,
          whatsapp: data.user.user_metadata?.whatsapp || undefined,
          telegram: data.user.user_metadata?.telegram || undefined,
          referral_link: undefined,
          referralBalance: undefined,
        }

        return {
          user,
          session: data.session as SupabaseSession,
        }
      }

      return { user: null, session: null, error: 'Неизвестная ошибка' }
    } catch (error) {
      return { user: null, session: null, error: 'Произошла ошибка при входе' }
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.first_name,
            last_name: credentials.last_name,
          },
        },
      })

      if (error) {
        return { user: null, session: null, error: this.getErrorMessage(error.message) }
      }

      if (data.user) {
        const user: TUser = {
          ...data.user,
          id: data.user.id,
          email: data.user.email || '',
          username: undefined,
          first_name: credentials.first_name,
          last_name: credentials.last_name,
          whatsapp: undefined,
          telegram: undefined,
          referral_link: undefined,
          referralBalance: undefined,
        }

        return {
          user,
          session: data.session as SupabaseSession,
        }
      }

      return { user: null, session: null, error: 'Неизвестная ошибка' }
    } catch (error) {
      return { user: null, session: null, error: 'Произошла ошибка при регистрации' }
    }
  }

  async logout(): Promise<{ error: AuthError | null }> {
    return await supabase.auth.signOut()
  }

  async refreshSession(): Promise<AuthResponse> {
    try {
      // Добавляем таймаут для Supabase запроса
      const sessionPromise = supabase.auth.getSession()
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Supabase getSession timeout')), 5000)
      })
      
      const { data: sessionData, error: sessionError } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as Awaited<ReturnType<typeof supabase.auth.getSession>>
      
      if (sessionError) {
        return {
          user: null,
          session: null,
          error: this.getErrorMessage(sessionError.message)
        }
      }

      // Если сессии нет, возвращаем null без ошибки
      if (!sessionData.session || !sessionData.session.user) {
        return {
          user: null,
          session: null
        }
      }

      // Преобразуем User в TUser
      const user: TUser = {
        ...sessionData.session.user,
        id: sessionData.session.user.id,
        email: sessionData.session.user.email || '',
        username: sessionData.session.user.user_metadata?.username || undefined,
        first_name: sessionData.session.user.user_metadata?.first_name || undefined,
        last_name: sessionData.session.user.user_metadata?.last_name || undefined,
        whatsapp: sessionData.session.user.user_metadata?.whatsapp || undefined,
        telegram: sessionData.session.user.user_metadata?.telegram || undefined,
        referral_link: undefined,
        referralBalance: undefined,
      }
      
      return {
        user,
        session: sessionData.session as SupabaseSession,
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: 'Ошибка при обновлении сессии'
      }
    }
  }

  async resetPassword(email: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-new-password`,
      })

      if (error) {
        return { error: this.getErrorMessage(error.message) }
      }

      return {}
    } catch (error) {
      return { error: 'Произошла ошибка при сбросе пароля' }
    }
  }

  async changePassword(newPassword: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { error: this.getErrorMessage(error.message) }
      }

      return {}
    } catch (error) {
      return { error: 'Произошла ошибка при смене пароля' }
    }
  }

  async changePasswordWithReauth(oldPassword: string, newPassword: string): Promise<{ error?: string }> {
    try {
      // Получаем текущего пользователя
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        return { error: 'Пользователь не найден' }
      }

      // Проверяем старый пароль через попытку входа
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      })

      if (signInError) {
        return { error: 'Неверный текущий пароль' }
      }

      // Если старый пароль верный, обновляем на новый
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { error: this.getErrorMessage(error.message) }
      }

      return {}
    } catch (error) {
      return { error: 'Произошла ошибка при смене пароля' }
    }
  }

  async updateProfile(updates: Partial<TUser>): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: updates.username,
          first_name: updates.first_name,
          last_name: updates.last_name,
          whatsapp: updates.whatsapp,
          telegram: updates.telegram,
        },
      })

      if (error) {
        return { error: this.getErrorMessage(error.message) }
      }

      return {}
    } catch (error) {
      return { error: 'Произошла ошибка при обновлении профиля' }
    }
  }

  private getErrorMessage(message: string): string {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Неверный email или пароль',
      'Email not confirmed': 'Email не подтвержден',
      'Invalid email': 'Неверный формат email',
      'Password should be at least 6 characters': 'Пароль должен содержать не менее 6 символов',
      'User already registered': 'Пользователь уже зарегистрирован',
      'Email already registered': 'Email уже зарегистрирован',
      'Signup not allowed for this instance': 'Регистрация отключена',
      'Too many requests': 'Слишком много запросов, попробуйте позже',
      'user not found': 'Пользователь с таким email не найден',
    }

    return errorMessages[message] || 'Произошла неизвестная ошибка. Попробуйте снова.'
  }
}

export const authService = new AuthService()

// Helper functions for compatibility
// Эти функции больше не нужны, так как логика токена и выхода теперь в useAuthStore и api interceptor
// export const getToken = async (): Promise<string | null> => {
//   const { data } = await supabase.auth.getSession()
//   return data.session?.access_token || null
// }

// export const clearAuthData = async (): Promise<void> => {
//   await supabase.auth.signOut()
// }
