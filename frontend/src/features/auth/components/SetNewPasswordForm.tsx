import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { Button } from '@/shared/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/Form';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  setNewPasswordSchema,
  type SetNewPasswordFormData,
} from '@/features/auth/validation';

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
  
  // Локальные состояния больше не нужны. Валидация и show/hide в PasswordInput

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

  // Автофокус будет установлен декларативно через form.setFocus

  // Устанавливаем фокус на поле нового пароля при монтировании
  useEffect(() => {
    form.setFocus('password');
  }, [form]);

  /**
   * Обработка отправки формы
   */
  const onSubmit = async (data: SetNewPasswordFormData) => {
    try {
      const result = await changePassword(data.password);
      if (!result.error) {
        navigate('/');
      }
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
          {/* Новый пароль */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Новый пароль <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Минимум 8 символов"
                    autoComplete="new-password"
                    aria-describedby={
                      fieldState.error ? `${field.name}-error` : undefined
                    }
                    variant={fieldState.error ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
          />

          {/* Подтверждение пароля */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Подтвердите пароль <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Повторите пароль"
                    autoComplete="new-password"
                    aria-describedby={
                      fieldState.error ? `${field.name}-error` : undefined
                    }
                    variant={fieldState.error ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
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