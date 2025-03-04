import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormData } from '@/shared/validation/auth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useNotification } from '@/lib/hooks/useNotification';
import { authAPI } from '@/lib/api/services/auth';
import { Alert } from '@/shared/ui/Alert';

export const ChangePasswordForm = () => {
  const { success, error } = useNotification();

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
      await authAPI.changePassword(data.oldPassword, data.newPassword);
      success('Пароль успешно изменен');
      reset();
    } catch (err: any) {
      error(err.response?.data?.message || 'Не удалось изменить пароль');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
