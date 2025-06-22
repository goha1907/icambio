import { Link } from 'react-router-dom';
import { SetNewPasswordForm } from '@/features/auth/components/SetNewPasswordForm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/Card';

export const SetNewPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-gray-900">
              Установка нового пароля
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Введите новый пароль для вашего аккаунта
            </p>
          </CardHeader>

          <CardContent>
            <SetNewPasswordForm />
          </CardContent>

          <CardFooter className="text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
              Вернуться к входу
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}; 