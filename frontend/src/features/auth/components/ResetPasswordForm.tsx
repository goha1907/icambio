import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '@/shared/validation/auth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useNotification } from '@/lib/hooks/useNotification';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const ResetPasswordForm = () => {
  const { success, error } = useNotification();
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const result = await resetPassword(data.email);
      if (result.error) {
        error(result.error);
      } else {
        success('Инструкции по сбросу пароля отправлены на ваш email');
      }
    } catch (err: any) {
      error(err.message || 'Не удалось отправить инструкции по сбросу пароля');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Button variant="primary" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Отправка...' : 'Сбросить пароль'}
      </Button>
    </form>
  );
};
