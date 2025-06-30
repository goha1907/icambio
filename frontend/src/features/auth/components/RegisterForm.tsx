import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/Form';
import { Input } from '@/shared/ui/Input';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  registerSchema,
  RegisterFormData,
} from '@/shared/validation/auth';

/**
 * Компонент формы регистрации нового пользователя
 * 
 * Отвечает только за логику формы регистрации:
 * - Валидация полей с помощью React Hook Form + Zod
 * - Показать/скрыть пароль для обоих полей пароля
 * - Автофокус на поле email
 * - Улучшенная обработка ошибок через toast
 * - Accessibility поддержка
 * - Проверка совпадения паролей
 * 
 * Верстка страницы и общее расположение элементов находится в RegisterPage.tsx
 */
export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  
  // Состояния компонента
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  
  // Реф для автофокуса на поле email
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Инициализация формы с улучшенными настройками
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit', // Валидация только при отправке формы
    reValidateMode: 'onChange', // Перевалидация при изменении после первой отправки
  });

  // Автофокус на поле email при монтировании компонента
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Отслеживание изменений полей пароля для проверки совпадения
  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');

  useEffect(() => {
    if (confirmPassword && password && confirmPassword !== password) {
      setConfirmPasswordError('Пароли не совпадают');
    } else {
      setConfirmPasswordError('');
    }
  }, [password, confirmPassword]);

  /**
   * Переключение видимости основного пароля
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * Переключение видимости подтверждения пароля
   */
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  /**
   * Обработка отправки формы
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser(data);
      
      if (result.error) {
        // Ошибки показываются через toast в useAuth
        return;
      }

      // Успешная регистрация - перенаправляем на страницу подтверждения email
      navigate('/confirm-email');
    } catch (error) {
      console.error('Register form error:', error);
      // Ошибки показываются через toast в useAuth
    }
  };

  return (
    <div className="space-y-4">
      {/* Форма регистрации */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Поле Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email адрес <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={emailInputRef}
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                    variant={fieldState.error ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
          />

          {/* Поле Пароль */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Пароль <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Минимум 8 символов"
                      autoComplete="new-password"
                      aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                      variant={fieldState.error ? 'error' : 'default'}
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
          />

          {/* Поле Подтверждение пароля */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => {
              const hasError = fieldState.error || confirmPasswordError;
              return (
                <FormItem>
                  <FormLabel>Подтвердите пароль <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Повторите пароль"
                        autoComplete="new-password"
                        aria-describedby={hasError ? `${field.name}-error` : undefined}
                        variant={hasError ? 'error' : 'default'}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  {/* Показываем кастомную ошибку или стандартную ошибку формы */}
                  {confirmPasswordError ? (
                    <p className="text-sm font-medium text-destructive" id={`${field.name}-error`}>
                      {confirmPasswordError}
                    </p>
                  ) : (
                    <FormMessage id={`${field.name}-error`} />
                  )}
                </FormItem>
              );
            }}
          />

          {/* Информация о требованиях к паролю */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Требования к паролю:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Минимум 8 символов</li>
              <li>Рекомендуется использовать буквы, цифры и символы</li>
            </ul>
          </div>

          {/* Кнопка отправки */}
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Регистрация...
              </>
            ) : (
              'Создать аккаунт'
            )}
          </Button>

          {/* Ссылка на вход */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <Link 
                to="/login" 
                className="font-medium text-icmop-primary hover:text-icmop-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                Войти в систему
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}; 