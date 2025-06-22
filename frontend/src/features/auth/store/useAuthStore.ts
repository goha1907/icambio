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
        set({
          user,
          session,
          isAuthenticated: !!(user && session),
          error: null,
        })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      logout: () => {
        set({ user: null, session: null, isAuthenticated: false, error: null })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        hasUser: !!state.user,
        hasSession: !!state.session,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = true
        }
      }
    }
  )
) 