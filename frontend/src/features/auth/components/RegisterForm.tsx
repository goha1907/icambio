import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/shared/validation/auth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useDispatch } from 'react-redux';
import { register as registerAction } from '@/features/auth/store/authSlice';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import { Alert } from '@/shared/ui/Alert';
import type { AppDispatch } from '@/store';
import type { RegisterData } from '@/types';

export const RegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const { handleSubmit, isSubmitting } = useFormSubmit<RegisterFormData>({
    onSubmit: async (data) => {
      const registerData: RegisterData = {
        email: data.email,
        password: data.password,
        re_password: data.confirmPassword,
      };
      return dispatch(registerAction(registerData)).unwrap();
    },
    successMessage: 'Регистрация прошла успешно',
    errorMessage: 'Ошибка при регистрации. Проверьте данные и попробуйте снова.',
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

      <div className="form-group">
        <Input 
          {...register('confirmPassword')} 
          type="password" 
          label="Подтверждение пароля" 
          error={errors.confirmPassword?.message} 
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
        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
};