import { Link } from 'react-router-dom';
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/Card';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';

export const ChangePasswordPage = () => {
  return (
    <ProtectedRoute>
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