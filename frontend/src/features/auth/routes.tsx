import { RouteObject } from 'react-router-dom'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { ChangePasswordPage } from '@/pages/auth/ChangePasswordPage'
import { ConfirmEmailPage } from '@/pages/auth/ConfirmEmailPage'

export const authRoutes: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'reset-password', element: <ResetPasswordPage /> },
  { path: 'change-password', element: <ChangePasswordPage /> },
  { path: 'confirm-email', element: <ConfirmEmailPage /> },
]

export const AuthRoutes = () => {
  return null; // Deprecated, use authRoutes array instead
}
