import { supabase } from '@/config/supabase'
import type { SupabaseSession, TUser, IUserProfile } from '@/types'
import api from '@/shared/api/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: TUser | null
  session: SupabaseSession | null
  error?: string
}

class AuthService {
  private async getUserProfile(supabaseUserId: string, email: string): Promise<IUserProfile | null> {
    try {
      const response = await api.get(`/users/${supabaseUserId}/profile/`);
      return { ...response.data, email: email, id: response.data.id };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return {
          user: null,
          session: null,
          error: this.getErrorMessage(error.message)
        }
      }

      if (data.user && data.session) {
        const userProfile = await this.getUserProfile(data.user.id, data.user.email || '');
        const combinedUser: TUser | null = userProfile ? { ...data.user, ...userProfile } : null;

        return {
          user: combinedUser,
          session: data.session
        }
      }
      
      return {
        user: null,
        session: null,
        error: 'Неизвестная ошибка при входе'
      }

    } catch (error) {
      return {
        user: null,
        session: null,
        error: 'Произошла неизвестная ошибка'
      }
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        return {
          user: null,
          session: null,
          error: 'Пароли не совпадают'
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      })

      if (error) {
        return {
          user: null,
          session: null,
          error: this.getErrorMessage(error.message)
        }
      }

      // Для Supabase с подтверждением email - пользователь создается, но сессия пуста
      if (data.user && !data.session) {
        // Профиль может быть создан на бэкенде автоматически после регистрации
        // Но мы не можем получить его сейчас, так как нет сессии для авторизации запроса
        // Поэтому возвращаем только данные Supabase пользователя
        const partialUser: TUser = {
          ...data.user,
          id: data.user.id, // Supabase user ID
          email: data.user.email || '',
          // Остальные поля IUserProfile будут пустыми или undefined
          username: undefined,
          first_name: undefined,
          last_name: undefined,
          whatsapp: undefined,
          telegram: undefined,
          referral_link: undefined,
          referralBalance: undefined,
        };
        return {
          user: partialUser,
          session: null
        }
      }

      if (data.user && data.session) {
        const userProfile = await this.getUserProfile(data.user.id, data.user.email || '');
        const combinedUser: TUser | null = userProfile ? { ...data.user, ...userProfile } : null;

        return {
          user: combinedUser,
          session: data.session
        }
      }

      return {
        user: null,
        session: null,
        error: 'Неизвестная ошибка при регистрации'
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: 'Произошла неизвестная ошибка'
      }
    }
  }

  async logout(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error: this.getErrorMessage(error.message) }
      }

      return {}
    } catch (error) {
      return { error: 'Произошла неизвестная ошибка' }
    }
  }

  async getCurrentSession(): Promise<{ data: { session: SupabaseSession | null } }> {
    return await supabase.auth.getSession()
  }

  async refreshSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        return {
          user: null,
          session: null,
          error: this.getErrorMessage(error.message)
        }
      }

      if (data.user && data.session) {
        const userProfile = await this.getUserProfile(data.user.id, data.user.email || '');
        const combinedUser: TUser | null = userProfile ? { ...data.user, ...userProfile } : null;

        return {
          user: combinedUser,
          session: data.session
        }
      }

      return {
        user: null,
        session: null,
        error: 'Неизвестная ошибка при обновлении сессии'
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: 'Произошла неизвестная ошибка'
      }
    }
  }

  async resetPassword(email: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`
        }
      )

      if (error) {
        return { error: this.getErrorMessage(error.message) }
      }

      return {}
    } catch (error) {
      return { error: 'Произошла неизвестная ошибка' }
    }
  }

  private getErrorMessage(errorMessage: string): string {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Неверный email или пароль',
      'Email not confirmed': 'Email не подтвержден',
      'User already registered': 'Пользователь уже зарегистрирован',
      'Password should be at least 6 characters': 'Пароль должен содержать минимум 6 символов',
      'Invalid email': 'Неверный формат email',
      'Email already registered': 'Email уже зарегистрирован',
      'Signup not allowed for this instance': 'Регистрация отключена',
      'Too many requests': 'Слишком много запросов, попробуйте позже'
    }

    return errorMessages[errorMessage] || errorMessage || 'Произошла ошибка'
  }

  async changePassword(newPassword: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: this.getErrorMessage(error.message) };
      }
      return {};
    } catch (error) {
      return { error: 'Произошла неизвестная ошибка при смене пароля' };
    }
  }

  async updateProfile(userId: string, data: Partial<IUserProfile>): Promise<{ error?: string }> {
    try {
      // Отправляем только те поля, которые изменились
      const response = await api.put(`/users/${userId}/profile/`, data);
      if (response.status === 200) {
        return {};
      } else {
        return { error: 'Не удалось обновить профиль' };
      }
    } catch (error: any) {
      return { error: error.response?.data?.detail || 'Произошла неизвестная ошибка при обновлении профиля' };
    }
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
