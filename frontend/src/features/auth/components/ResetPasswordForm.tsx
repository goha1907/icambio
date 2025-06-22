import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { resetPasswordSchema, ResetPasswordFormData } from '@/shared/validation/auth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useState } from 'react';

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError('');
      const result = await resetPassword(data.email);
      if (result.error) {
        setError(result.error);
      } else {
        // Перенаправляем на страницу подтверждения
        navigate('/reset-password-sent');
      }
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить инструкции по сбросу пароля');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button variant="primary" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Отправка...' : 'Сбросить пароль'}
      </Button>
    </form>
  );
};
