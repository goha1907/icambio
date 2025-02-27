// frontend/src/pages/auth/ResetPasswordPage.tsx
import { Link } from 'react-router-dom';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

export const ResetPasswordPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-md w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Восстановление пароля</CardTitle>
          </CardHeader>

          <CardContent>
            <ResetPasswordForm />
          </CardContent>

          <CardFooter>
            <Link to="/login" className="link">
              Вернуться к входу
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};