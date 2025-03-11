import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/shared/validation/auth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import { Alert } from '@/shared/ui/Alert';
import type { AppDispatch } from '@/store';
import type { LoginCredentials } from '@/types';

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const { handleSubmit, isSubmitting } = useFormSubmit<LoginFormData>({
    onSubmit: async (data) => {
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password
      };
      return dispatch(login(credentials)).unwrap();
    },
    successMessage: 'Вход выполнен успешно',
    errorMessage: 'Ошибка при входе. Проверьте данные и попробуйте снова.',
    redirectPath: '/profile'
  });

  return (
    <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
      <div className="form-group">
        <Input 
          {...register('email')} 
          label="Email" 
          type="email" 
          error={errors.email?.message} 
        />
      </div>

      <div className="form-group">
        <Input 
          {...register('password')} 
          type="password" 
          label="Пароль" 
          error={errors.password?.message} 
        />
      </div>

      {errors.root && (
        <Alert type="error">
          {errors.root.message}
        </Alert>
      )}

      <Button 
        variant="primary" 
        disabled={isSubmitting} 
        className="w-full"
      >
        {isSubmitting ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  );
};