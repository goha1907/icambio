import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormData } from '@/shared/validation/auth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Alert } from '@/shared/ui/Alert';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';

export const ChangePasswordForm = () => {
  const { changePasswordWithReauth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setError('');

      // Используем новый метод changePasswordWithReauth
      const result = await changePasswordWithReauth(data.oldPassword, data.newPassword);
      
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success('Пароль успешно изменен');
        reset();
        // Перенаправляем на профиль согласно требованиям
        navigate('/profile');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось изменить пароль';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Изменение пароля</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <Alert type="destructive">{error}</Alert>}

          <div className="form-group">
            <Input
              type="password"
              label="Текущий пароль"
              {...register('oldPassword')}
              error={errors.oldPassword?.message}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <Input
              type="password"
              label="Новый пароль"
              {...register('newPassword')}
              error={errors.newPassword?.message}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <Input
              type="password"
              label="Подтверждение нового пароля"
              {...register('confirmNewPassword')}
              error={errors.confirmNewPassword?.message}
              placeholder="••••••••"
            />
          </div>

          {errors.root && <Alert type="destructive">{errors.root.message}</Alert>}

          <Button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Изменение...' : 'Изменить пароль'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/profile" className="form-link">
            Вернуться в профиль
          </Link>
        </div>
      </div>
    </div>
  );
};
