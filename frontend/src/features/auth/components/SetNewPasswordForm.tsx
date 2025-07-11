import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PasswordInput } from '@/shared/ui';
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

  // autoFocus handled by PasswordInput, совпадение паролей проверяет zod-схема

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
          <PasswordInput
            control={form.control}
            name="password"
            label={<>Новый пароль <span className="text-destructive">*</span></>}
                      placeholder="Минимум 8 символов"
                      autoComplete="new-password"
            autoFocus
                      disabled={isLoading}
          />

          {/* Подтверждение пароля */}
          <PasswordInput
            control={form.control}
            name="confirmPassword"
            label={<>Подтвердите пароль <span className="text-destructive">*</span></>}
                        placeholder="Повторите пароль"
                        autoComplete="new-password"
                        disabled={isLoading}
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