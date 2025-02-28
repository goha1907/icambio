import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/Card';

export const LoginPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-md w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Link to="/reset-password" className="link">
              Забыли пароль?
            </Link>

            <p className="text-secondary">
              Нет аккаунта?{' '}
              <Link to="/register" className="link">
                Зарегистрироваться
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
