import { RouteObject } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { ChangePasswordPage } from '@/pages/auth/ChangePasswordPage';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: 'reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: 'change-password',
    element: (
      <ProtectedRoute>
        <ChangePasswordPage />
      </ProtectedRoute>
    ),
  },
];
