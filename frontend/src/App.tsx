import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Import pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ConfirmEmailPage } from './pages/auth/ConfirmEmailPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';
import { ExchangePage } from './pages/exchange/ExchangePage';
import { OrderDetailsPage } from './pages/exchange/OrderDetailsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { EditProfilePage } from './pages/profile/EditProfilePage';
import { RatesPage } from './pages/static/RatesPage';
import { ReviewsPage } from './pages/static/ReviewsPage';

import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './shared/ui/ProtectedRoute';
import { useAuthStore } from './features/auth/store/useAuthStore';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Загрузка приложения...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="confirm-email" element={<ConfirmEmailPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
            <Route path="rates" element={<RatesPage />} />
            <Route path="reviews" element={<ReviewsPage />} />

            {/* Защищенные маршруты */}
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/edit" element={<EditProfilePage />} />
              <Route path="exchange" element={<ExchangePage />} />
              <Route path="order/:id" element={<OrderDetailsPage />} />
            </Route>
          </Route>
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
