import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import { FormField } from '@/shared/ui/Form';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import { useAuth } from '../hooks/useAuth';
import { RegisterData } from '@/types';

export function RegisterForm() {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData>();

  const { register: registerUser } = useAuth();
  const { handleSubmit, isSubmitting } = useFormSubmit<RegisterData>({
    onSubmit: registerUser,
    successMessage: 'Регистрация успешно завершена',
    errorMessage: 'Ошибка при регистрации',
  });

  const password = watch('password');

  return (
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
      <FormField
        label="Подтверждение пароля"
        type="password"
        {...register('re_password', {
          required: 'Подтверждение пароля обязательно',
          validate: (value) =>
            value === password || 'Пароли не совпадают',
        })}
        error={errors.re_password?.message}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
}