import api from '@/shared/api/api'
import { API_ENDPOINTS } from '@/shared/config/api'
import type { TUser, DjangoJWTResponse, DjangoUser, LoginCredentials, RegisterData } from '@/types'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

export interface AuthResponse {
  user: TUser | null
  tokens: DjangoJWTResponse | null
  error?: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post(API_ENDPOINTS.auth.login, credentials)
      const tokens: DjangoJWTResponse = response.data

      // Получаем информацию о пользователе
      const userResponse = await api.get(API_ENDPOINTS.auth.profile)
      const djangoUser: DjangoUser = userResponse.data

      const user: TUser = {
        id: djangoUser.id,
        email: djangoUser.email,
        username: djangoUser.username,
        first_name: djangoUser.first_name,
        last_name: djangoUser.last_name,
        whatsapp: undefined,
        telegram: undefined,
        preferred_delivery_address: undefined,
        referral_code: undefined,
        referral_link: undefined,
        invited_by_code: undefined,
        referralBalance: undefined,
        referrals: undefined,
      }

      return { user, tokens }
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error.response?.data || error.message)
      return { user: null, tokens: null, error: errorMessage }
    }
  }

  async register(credentials: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post(API_ENDPOINTS.auth.register, credentials)
      
      // Для Django Allauth регистрация может требовать подтверждения email
      if (response.data.detail === 'Verification e-mail sent.') {
        return { user: null, tokens: null, error: 'Проверьте email для подтверждения регистрации' }
      }

      // Если регистрация прошла успешно и пользователь сразу авторизован
      if (response.data.access) {
        const tokens: DjangoJWTResponse = response.data
        
        // Получаем информацию о пользователе
        const userResponse = await api.get(API_ENDPOINTS.auth.profile)
        const djangoUser: DjangoUser = userResponse.data

        const user: TUser = {
          id: djangoUser.id,
          email: djangoUser.email,
          username: djangoUser.username,
          first_name: djangoUser.first_name,
          last_name: djangoUser.last_name,
          whatsapp: undefined,
          telegram: undefined,
          preferred_delivery_address: undefined,
          referral_code: undefined,
          referral_link: undefined,
          invited_by_code: undefined,
          referralBalance: undefined,
          referrals: undefined,
        }

        return { user, tokens }
      }

      return { user: null, tokens: null, error: 'Неизвестная ошибка при регистрации' }
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error.response?.data || error.message)
      return { user: null, tokens: null, error: errorMessage }
    }
  }

  async logout(): Promise<{ error?: string }> {
    try {
      await api.post(API_ENDPOINTS.auth.logout)
      return {}
    } catch (error: any) {
      // Даже если logout на сервере не удался, очищаем локальное состояние
      return {}
    }
  }

  async refreshTokens(): Promise<AuthResponse> {
    try {
      const { tokens } = useAuthStore.getState()
      
      if (!tokens?.refresh) {
        return { user: null, tokens: null, error: 'Нет refresh токена' }
      }

      const response = await api.post('/auth/jwt/refresh/', {
        refresh: tokens.refresh
      })

      const newTokens: DjangoJWTResponse = {
        access: response.data.access,
        refresh: tokens.refresh // Используем старый refresh токен
      }

      // Получаем информацию о пользователе
      const userResponse = await api.get(API_ENDPOINTS.auth.profile)
      const djangoUser: DjangoUser = userResponse.data

      const user: TUser = {
        id: djangoUser.id,
        email: djangoUser.email,
        username: djangoUser.username,
        first_name: djangoUser.first_name,
        last_name: djangoUser.last_name,
        whatsapp: undefined,
        telegram: undefined,
        preferred_delivery_address: undefined,
        referral_code: undefined,
        referral_link: undefined,
        invited_by_code: undefined,
        referralBalance: undefined,
        referrals: undefined,
      }

      return { user, tokens: newTokens }
    } catch (error: any) {
      return { user: null, tokens: null, error: 'Ошибка при обновлении токенов' }
    }
  }

  async resetPassword(email: string): Promise<{ error?: string }> {
    try {
      await api.post(API_ENDPOINTS.auth.resetPassword, { email })
      return {}
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error.response?.data || error.message)
      return { error: errorMessage }
    }
  }

  async changePassword(newPassword: string): Promise<{ error?: string }> {
    try {
      await api.post('/auth/users/set_password/', {
        new_password: newPassword
      })
      return {}
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error.response?.data || error.message)
      return { error: errorMessage }
    }
  }

  async changePasswordWithReauth(oldPassword: string, newPassword: string): Promise<{ error?: string }> {
    try {
      await api.post('/auth/users/set_password/', {
        current_password: oldPassword,
        new_password: newPassword
      })
      return {}
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error.response?.data || error.message)
      return { error: errorMessage }
    }
  }

  async updateProfile(updates: Partial<TUser>): Promise<{ error?: string }> {
    try {
      await api.patch(API_ENDPOINTS.auth.profile, updates)
      return {}
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error.response?.data || error.message)
      return { error: errorMessage }
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await api.get(API_ENDPOINTS.auth.profile)
      const djangoUser: DjangoUser = response.data

      const user: TUser = {
        id: djangoUser.id,
        email: djangoUser.email,
        username: djangoUser.username,
        first_name: djangoUser.first_name,
        last_name: djangoUser.last_name,
        whatsapp: undefined,
        telegram: undefined,
        preferred_delivery_address: undefined,
        referral_code: undefined,
        referral_link: undefined,
        invited_by_code: undefined,
        referralBalance: undefined,
        referrals: undefined,
      }

      return { user, tokens: null }
    } catch (error: any) {
      return { user: null, tokens: null, error: 'Ошибка при получении пользователя' }
    }
  }

  private getErrorMessage(data: any): string {
    if (typeof data === 'string') {
      return data
    }

    if (data?.detail) {
      return data.detail
    }

    if (data?.email) {
      return data.email[0]
    }

    if (data?.password) {
      return data.password[0]
    }

    if (data?.non_field_errors) {
      return data.non_field_errors[0]
    }

    return 'Произошла ошибка'
  }
}

export const authService = new AuthService()
