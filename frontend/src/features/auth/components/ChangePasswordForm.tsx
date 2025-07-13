import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/Form';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/features/auth/validation';

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
  // Локальные переключатели показа пароля и ручная проверка больше не нужны
  
  // Автофокус будет установлен декларативно через form.setFocus

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

  // Устанавливаем фокус на поле текущего пароля при монтировании
  useEffect(() => {
    form.setFocus('oldPassword');
  }, [form]);

  // Валидация совпадения паролей полностью в zod-схеме

  /**
   * Локальные toggle функции больше не нужны
   */

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
                <FormLabel>
                  Текущий пароль <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Введите текущий пароль"
                    autoComplete="current-password"
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

          {/* Поле Новый пароль */}
          <FormField
            control={form.control}
            name="newPassword"
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

          {/* Подтверждение нового пароля */}
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Подтвердите новый пароль <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Повторите новый пароль"
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
