// frontend/src/pages/auth/ChangePasswordPage.tsx
import { Link } from 'react-router-dom';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

export const ChangePasswordPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <div className="page-container">
        <div className="max-w-md w-full mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Изменение пароля</CardTitle>
            </CardHeader>

            <CardContent>
              <ChangePasswordForm />
            </CardContent>

            <CardFooter>
              <Link to="/profile" className="link">
                Вернуться в профиль
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};