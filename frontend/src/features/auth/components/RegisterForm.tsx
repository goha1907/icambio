import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/shared/validation/auth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register as registerAction } from '@/features/auth/store/authSlice';
import { useNotification } from '@/lib/hooks/useNotification';
import type { AppDispatch } from '@/store';
import type { RegisterData } from '@/types';

export const RegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const registerData: RegisterData = {
      email: data.email,
      password: data.password,
      re_password: data.confirmPassword,
    };

    try {
      const result = await dispatch(registerAction(registerData)).unwrap();
      if (result && result.token) {
        navigate('/profile');
      }
    } catch (err: any) {
      error(err.message || 'Ошибка регистрации');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input
        label="Пароль"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Input
        label="Подтверждение пароля"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <Button variant="primary" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
};
