import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/shared/validation/auth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '@/features/auth/store/authSlice';
import { useNotification } from '@/lib/hooks/useNotification';
import type { AppDispatch } from '@/store';
import type { LoginCredentials } from '@/types';
import { Loader } from '@/shared/ui/Loader';
import { Alert } from '@/shared/ui/Alert';

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const credentials: LoginCredentials = {
      email: data.email,
      password: data.password,
    };

    try {
      const result = await dispatch(login(credentials)).unwrap();
      if (result.user && result.token) {
        navigate('/profile');
      }
    } catch (err: any) {
      error(err.message || 'Ошибка входа');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isSubmitting && <Loader />}

      <div className="form-group">
        <Input {...register('email')} label="Email" type="email" error={errors.email?.message} />
      </div>

      <div className="form-group">
        <Input
          {...register('password')}
          type="password"
          label="Пароль"
          error={errors.password?.message}
        />
      </div>

      {errors.root && <Alert type="error">{errors.root.message}</Alert>}

      <Button variant="primary" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  );
};
