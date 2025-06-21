import { Link } from 'react-router-dom';
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/Card';

export const ChangePasswordPage = () => {
  return (
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
  );
}; 