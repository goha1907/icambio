import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Alert } from '@/shared/ui/Alert';
import { Loader } from '@/shared/ui/Loader';
import { supabase } from '@/config/supabase';

const setNewPasswordSchema = z
  .object({
    token: z.string().min(1, 'Токен обязателен'),
    uid: z.string().min(1, 'UID обязателен'),
    newPassword: z.string().min(6, 'Новый пароль должен содержать минимум 6 символов'),
    confirmNewPassword: z.string().min(1, 'Подтвердите новый пароль'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmNewPassword'],
  });

type SetNewPasswordFormData = z.infer<typeof setNewPasswordSchema>;

interface SetNewPasswordFormProps {
  onPasswordSet: () => void;
}

export const SetNewPasswordForm = ({ onPasswordSet }: SetNewPasswordFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SetNewPasswordFormData>({
    resolver: zodResolver(setNewPasswordSchema),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setValue('token', params.get('token') || '');
    setValue('uid', params.get('uid') || '');
  }, [setValue]);

  const onSubmit = async (data: SetNewPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: supabaseError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      setIsSuccess(true);
      await supabase.auth.signOut();
      onPasswordSet();
    } catch (err: any) {
      setError(err.message || 'Не удалось установить новый пароль');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Alert type="success" className="text-center">
        Ваш пароль успешно обновлен. Теперь вы можете войти, используя новый пароль.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Новый пароль"
        type="password"
        {...register('newPassword')}
        error={errors.newPassword?.message}
      />
      <Input
        label="Повторите новый пароль"
        type="password"
        {...register('confirmNewPassword')}
        error={errors.confirmNewPassword?.message}
      />
      {error && <Alert type="destructive">{error}</Alert>}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader /> : 'Установить новый пароль'}
      </Button>
    </form>
  );
}; 