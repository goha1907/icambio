import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { resetPasswordSchema, ResetPasswordFormData } from '@/shared/validation/auth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useState } from 'react';
import { Alert } from '@/shared/ui/Alert';

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
        // Примечание: Supabase не раскрывает информацию о существовании email из соображений безопасности
        navigate('/reset-password-sent');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить инструкции по сбросу пароля');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Восстановление пароля</h2>
          <p className="text-gray-600">
            Введите ваш email, и мы отправим инструкции для сброса пароля.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-group">
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="example@mail.com"
            />
          </div>

          {error && <Alert type="destructive">{error}</Alert>}

          <Button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Сбросить пароль'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="form-link">
            Вернуться к входу
          </Link>
        </div>
      </div>
    </div>
  );
};
