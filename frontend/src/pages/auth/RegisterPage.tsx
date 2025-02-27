// frontend/src/pages/auth/RegisterPage.tsx
import { Link } from 'react-router-dom';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

export const RegisterPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-md w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
          </CardHeader>

          <CardContent>
            <RegisterForm />
          </CardContent>

          <CardFooter>
            <p className="text-secondary">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="link">
                Войти
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};