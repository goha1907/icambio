import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SupabaseSession, TUser } from '@/types'

interface AuthState {
  user: TUser | null
  session: SupabaseSession | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setAuth: (user: TUser | null, session: SupabaseSession | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, session) => {
        set({
          user,
          session,
          isAuthenticated: !!user && !!session,
          isLoading: false
        })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      logout: () => {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
) 