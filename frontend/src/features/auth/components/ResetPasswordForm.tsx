import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
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
import { Input } from '@/shared/ui/Input';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from '@/shared/validation/auth';

/**
 * Компонент формы запроса сброса пароля
 * 
 * Отвечает только за логику формы сброса пароля:
 * - Валидация email с помощью React Hook Form + Zod
 * - Автофокус на поле email
 * - Улучшенная обработка ошибок через toast
 * - Accessibility поддержка
 * - Отправка запроса на сброс пароля
 * 
 * Верстка страницы и общее расположение элементов находится в ResetPasswordPage.tsx
 */
export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuth();
  
  // Реф для автофокуса на поле email
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Инициализация формы с улучшенными настройками
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onSubmit', // Валидация только при отправке формы
    reValidateMode: 'onChange', // Перевалидация при изменении после первой отправки
  });

  // Автофокус на поле email при монтировании компонента
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  /**
   * Обработка отправки формы
   */
  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const result = await resetPassword(data.email);
      
      if (result.error) {
        // Ошибки показываются через toast в useAuth
        return;
      }

      // Успешная отправка - редиректим на страницу подтверждения через задержку
      setTimeout(() => {
        navigate('/reset-password-sent');
      }, 1000);
    } catch (error) {
      console.error('Reset password form error:', error);
      // Ошибки показываются через toast в useAuth
    }
  };

  return (
    <div className="space-y-4">
      {/* Форма сброса пароля */}
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

          {/* Информация для пользователя */}
          <div className="text-sm text-muted-foreground">
            <p>
              Мы отправим инструкции по восстановлению пароля на указанный email адрес.
              Проверьте папку "Спам", если письмо не появилось в основной папке.
            </p>
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
                Отправка инструкций...
              </>
            ) : (
              'Отправить инструкции'
            )}
          </Button>

          {/* Ссылка на возврат к входу */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Вспомнили пароль?{' '}
              <Link 
                to="/login" 
                className="font-medium text-icmop-primary hover:text-icmop-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                Вернуться ко входу
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};
