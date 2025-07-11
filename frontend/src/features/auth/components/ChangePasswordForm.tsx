import React from 'react';
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
import { PasswordInput } from '@/shared/ui';
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
  
  // autoFocus будет передан в PasswordInput

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

  // autofocus handled by component directly

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
          <PasswordInput
          control={form.control}
          name="oldPassword"
            label={<>Текущий пароль <span className="text-destructive">*</span></>}
                      placeholder="Введите текущий пароль"
                      autoComplete="current-password"
                      disabled={isLoading}
            autoFocus
        />

          {/* Поле Новый пароль */}
          <PasswordInput
          control={form.control}
          name="newPassword"
            label={<>Новый пароль <span className="text-destructive">*</span></>}
                      placeholder="Минимум 8 символов"
                      autoComplete="new-password"
                      disabled={isLoading}
        />

          {/* Подтверждение нового пароля */}
          <PasswordInput
          control={form.control}
          name="confirmNewPassword"
            label={<>Подтвердите новый пароль <span className="text-destructive">*</span></>}
                        placeholder="Повторите новый пароль"
                        autoComplete="new-password"
                        disabled={isLoading}
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
