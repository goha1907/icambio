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
  changePasswordSchema,
  ChangePasswordFormData,
} from '@/shared/validation/auth';

/**
 * Компонент формы смены пароля
 * 
 * Отвечает только за логику формы смены пароля:
 * - Валидация полей с помощью React Hook Form + Zod
 * - Показать/скрыть пароль для всех трех полей
 * - Автофокус на поле текущего пароля
 * - Проверка совпадения новых паролей в реальном времени
 * - Улучшенная обработка ошибок через toast
 * - Accessibility поддержка
 * - Сброс формы после успешной смены пароля
 * 
 * Используется в профиле пользователя или отдельной странице смены пароля
 */
export const ChangePasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { changePasswordWithReauth, isLoading } = useAuth();
  
  // Состояния компонента
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  
  // Реф для автофокуса на поле текущего пароля
  const oldPasswordInputRef = useRef<HTMLInputElement>(null);

  // Инициализация формы с улучшенными настройками
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { 
      oldPassword: '', 
      newPassword: '', 
      confirmNewPassword: '' 
    },
    mode: 'onSubmit', // Валидация только при отправке формы
    reValidateMode: 'onChange', // Перевалидация при изменении после первой отправки
  });

  // Автофокус на поле текущего пароля при монтировании компонента
  useEffect(() => {
    if (oldPasswordInputRef.current) {
      oldPasswordInputRef.current.focus();
    }
  }, []);

  // Отслеживание изменений полей новых паролей для проверки совпадения
  const newPassword = form.watch('newPassword');
  const confirmNewPassword = form.watch('confirmNewPassword');

  useEffect(() => {
    if (confirmNewPassword && newPassword && confirmNewPassword !== newPassword) {
      setConfirmPasswordError('Новые пароли не совпадают');
    } else {
      setConfirmPasswordError('');
    }
  }, [newPassword, confirmNewPassword]);

  /**
   * Переключение видимости текущего пароля
   */
  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(prev => !prev);
  };

  /**
   * Переключение видимости нового пароля
   */
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(prev => !prev);
  };

  /**
   * Переключение видимости подтверждения нового пароля
   */
  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(prev => !prev);
  };

  /**
   * Обработка отправки формы
   */
  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
    const result = await changePasswordWithReauth(data.oldPassword, data.newPassword);
      
    if (result.error) {
        // Ошибки показываются через toast в useAuth
        return;
      }

      // Успешная смена пароля - сбрасываем форму и редиректим на профиль
      form.reset();
      setConfirmPasswordError('');
      
      // Редирект на страницу профиля через небольшую задержку для показа toast
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error('Change password form error:', error);
      // Ошибки показываются через toast в useAuth
    }
  };

  return (
    <div className="space-y-4">
      {/* Форма смены пароля */}
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Поле Текущий пароль */}
        <FormField
          control={form.control}
          name="oldPassword"
            render={({ field, fieldState }) => (
            <FormItem>
                <FormLabel>Текущий пароль <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      ref={oldPasswordInputRef}
                      type={showOldPassword ? 'text' : 'password'}
                      placeholder="Введите текущий пароль"
                      autoComplete="current-password"
                      aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                      variant={fieldState.error ? 'error' : 'default'}
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleOldPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showOldPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      disabled={isLoading}
                    >
                      {showOldPassword ? (
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

          {/* Поле Новый пароль */}
        <FormField
          control={form.control}
          name="newPassword"
            render={({ field, fieldState }) => (
            <FormItem>
                <FormLabel>Новый пароль <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Минимум 8 символов"
                      autoComplete="new-password"
                      aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                      variant={fieldState.error ? 'error' : 'default'}
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleNewPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showNewPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      disabled={isLoading}
                    >
                      {showNewPassword ? (
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

          {/* Поле Подтверждение нового пароля */}
        <FormField
          control={form.control}
          name="confirmNewPassword"
            render={({ field, fieldState }) => {
              const hasError = fieldState.error || confirmPasswordError;
              return (
            <FormItem>
                  <FormLabel>Подтвердите новый пароль <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        placeholder="Повторите новый пароль"
                        autoComplete="new-password"
                        aria-describedby={hasError ? `${field.name}-error` : undefined}
                        variant={hasError ? 'error' : 'default'}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmNewPasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showConfirmNewPassword ? 'Скрыть пароль' : 'Показать пароль'}
                        disabled={isLoading}
                      >
                        {showConfirmNewPassword ? (
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

          {/* Информация о требованиях к новому паролю */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Требования к новому паролю:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Минимум 8 символов</li>
              <li>Должен отличаться от текущего пароля</li>
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
                Изменение пароля...
              </>
            ) : (
              'Изменить пароль'
            )}
        </Button>
      </form>
    </Form>
    </div>
  );
};
