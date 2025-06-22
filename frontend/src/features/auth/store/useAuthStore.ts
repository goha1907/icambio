import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SupabaseSession, TUser } from '@/types'

interface AuthState {
  user: TUser | null
  session: SupabaseSession | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setAuth: (user: TUser | null, session: SupabaseSession | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setAuth: (user, session) => {
        console.log('AuthStore: Setting auth', { hasUser: !!user, hasSession: !!session });
        set({
          user,
          session,
          isAuthenticated: !!(user && session),
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
        set({ user: null, session: null, isAuthenticated: false, error: null })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
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