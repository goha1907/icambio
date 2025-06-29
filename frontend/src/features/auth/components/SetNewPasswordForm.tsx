import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
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
  setNewPasswordSchema,
  SetNewPasswordFormData,
} from '@/shared/validation/auth';

/**
 * Компонент формы установки нового пароля
 * 
 * Отвечает только за логику формы установки нового пароля:
 * - Валидация полей с помощью React Hook Form + Zod
 * - Показать/скрыть пароль для обоих полей
 * - Автофокус на поле нового пароля
 * - Проверка совпадения паролей в реальном времени
 * - Улучшенная обработка ошибок через toast
 * - Accessibility поддержка
 * - Редирект на страницу входа после успешной установки пароля
 * 
 * Используется при восстановлении пароля по ссылке из email
 */
export const SetNewPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { changePassword, isLoading } = useAuth();
  
  // Состояния компонента
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  
  // Реф для автофокуса на поле нового пароля
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Инициализация формы с улучшенными настройками
  const form = useForm<SetNewPasswordFormData>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: { 
      password: '', 
      confirmPassword: '' 
    },
    mode: 'onSubmit', // Валидация только при отправке формы
    reValidateMode: 'onChange', // Перевалидация при изменении после первой отправки
  });

  // Автофокус на поле пароля при монтировании компонента
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  // Отслеживание изменений полей паролей для проверки совпадения
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
   * Переключение видимости нового пароля
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
  const onSubmit = async (data: SetNewPasswordFormData) => {
    try {
      const result = await changePassword(data.password);
      
      if (result.error) {
        // Ошибки показываются через toast в useAuth
        return;
      }

      // Успешная установка пароля - редиректим на главную страницу через задержку
      setTimeout(() => {
        navigate('/');
      }, 1500); // Чуть больше задержки для показа toast
    } catch (error) {
      console.error('Set new password form error:', error);
      // Ошибки показываются через toast в useAuth
    }
  };

  return (
    <div className="space-y-4">
      {/* Форма установки нового пароля */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Поле Новый пароль */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Новый пароль <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      ref={passwordInputRef}
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
                Установка пароля...
              </>
            ) : (
              'Установить пароль'
            )}
          </Button>

          {/* Информация о следующем шаге */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              После установки пароля вы будете перенаправлены на главную страницу
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}; 