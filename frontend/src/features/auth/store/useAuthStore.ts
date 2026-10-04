import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { TUser, DjangoJWTResponse } from '@/types'

interface AuthState {
  user: TUser | null
  tokens: DjangoJWTResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setAuth: (user: TUser | null, tokens: DjangoJWTResponse | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  updateTokens: (tokens: DjangoJWTResponse) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setAuth: (user, tokens) => {
        console.log('AuthStore: Setting auth', { hasUser: !!user, hasTokens: !!tokens });
        set({
          user,
          tokens,
          isAuthenticated: !!(user && tokens),
          error: null,
        })
      },

      setLoading: (isLoading: boolean) => {
        console.log('AuthStore: Setting loading to', isLoading);
        set({ isLoading })
      },

      setError: (error: string | null) => {
        console.log('AuthStore: Setting error', error);
        set({ error })
      },

      logout: () => {
        console.log('AuthStore: Logging out');
        set({ user: null, tokens: null, isAuthenticated: false, error: null })
      },

      updateTokens: (tokens: DjangoJWTResponse) => {
        console.log('AuthStore: Updating tokens');
        set({ tokens })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        console.log('AuthStore: Rehydrating from storage', { hasUser: !!state?.user });
        if (state) {
          // Всегда сбрасываем loading при восстановлении
          state.isLoading = false;
        }
      }
    }
  )
) 