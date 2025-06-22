import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormData } from '@/shared/validation/auth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Alert } from '@/shared/ui/Alert';
import { useNavigate } from 'react-router-dom';
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
    } catch (err: any) {
      const errorMessage = err.message || 'Не удалось изменить пароль';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}
      
      <div className="form-group">
        <Input
          type="password"
          label="Текущий пароль"
          {...register('oldPassword')}
          error={errors.oldPassword?.message}
        />
      </div>

      <div className="form-group">
        <Input
          type="password"
          label="Новый пароль"
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />
      </div>

      <div className="form-group">
        <Input
          type="password"
          label="Подтверждение нового пароля"
          {...register('confirmNewPassword')}
          error={errors.confirmNewPassword?.message}
        />
      </div>

      {errors.root && <Alert type="error">{errors.root.message}</Alert>}

      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Изменение пароля...' : 'Изменить пароль'}
      </Button>
    </form>
  );
};
