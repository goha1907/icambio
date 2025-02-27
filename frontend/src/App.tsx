// frontend/src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { ChangePasswordPage } from '@/pages/auth/ChangePasswordPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { EditProfilePage } from '@/pages/profile/EditProfilePage';
import { ExchangePage } from '@/pages/exchange/ExchangePage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentUser } from '@/store/slices/authSlice';
import { getToken } from '@/services/authService';
import type { AppDispatch } from '@/store';
import { AboutPage } from '@/pages/static/AboutPage';
import { RulesPage } from '@/pages/static/RulesPage';
import { AMLKYCPage } from '@/pages/static/AMLKYCPage';

function App() {
  const { isAuthenticated } = useAuth(); // из хука useAuth
  const dispatch = useDispatch<AppDispatch>();
  
  // При загрузке приложения проверяем аутентификацию
  useEffect(() => {
    // Если есть токен, получаем данные пользователя
    if (getToken()) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="exchange" element={<ExchangePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="aml-kyc" element={<AMLKYCPage />} />

            {/* Защищенные маршруты */}
            <Route
              path="profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile/edit"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="change-password"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;