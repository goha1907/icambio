import { RouteObject } from 'react-router-dom'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { ResetPasswordSentPage } from '@/pages/auth/ResetPasswordSentPage'
import { SetNewPasswordPage } from '@/pages/auth/SetNewPasswordPage'
import { ConfirmEmailPage } from '@/pages/auth/ConfirmEmailPage'

export const authRoutes: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'reset-password', element: <ResetPasswordPage /> },
  { path: 'reset-password-sent', element: <ResetPasswordSentPage /> },
  { path: 'set-new-password', element: <SetNewPasswordPage /> },
  { path: 'confirm-email', element: <ConfirmEmailPage /> },
]

export const AuthRoutes = () => {
  return null; // Deprecated, use authRoutes array instead
}
