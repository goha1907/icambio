import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { FormField } from '@/shared/ui/Form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/Card';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '@/types';

export function LoginForm() {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const { login } = useAuth();
  const { handleSubmit, isSubmitting } = useFormSubmit<LoginCredentials>({
    onSubmit: login,
    successMessage: 'Вы успешно вошли в систему',
    errorMessage: 'Ошибка входа в систему',
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Вход в систему</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
          <FormField
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email обязателен',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный формат email',
              },
            })}
            error={errors.email?.message}
          />
          <FormField
            label="Пароль"
            type="password"
            {...register('password', {
              required: 'Пароль обязателен',
              minLength: {
                value: 8,
                message: 'Пароль должен содержать минимум 8 символов',
              },
            })}
            error={errors.password?.message}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}