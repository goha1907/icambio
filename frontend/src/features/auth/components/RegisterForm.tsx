import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui';
import { PasswordInput } from '@/shared/ui/PasswordInput';
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
  type RegisterFormData,
} from '@/features/auth/validation';

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

  // Инициализация react-hook-form
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  
  // Состояния компонента
  // Переключатели видимости больше не нужны — логика внутри PasswordInput
  // Удалено confirmPasswordError, валидация теперь в zod
  
  // Автофокус на поле email при монтировании компонента
  useEffect(() => {
    form.setFocus('email');
  }, [form]);

  // Отслеживание изменений полей пароля для проверки совпадения
  // defaultValues обновлены ниже

  /**
   * Обработка отправки формы
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        re_password: data.confirmPassword,
      });
      
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
                <FormLabel>
                  Пароль <span className="text-destructive">*</span>
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

          {/* Поле Подтверждение пароля */}
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

          {/* Чекбокс согласия с условиями */}
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field, fieldState }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-describedby={fieldState.error ? 'terms-error' : undefined}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">
                    Я принимаю{' '}
                    <Link
                      to="/terms"
                      className="text-icambio-primary underline-offset-4 hover:underline"
                    >
                      условия использования
                    </Link>
                  </FormLabel>
                  <FormMessage id="terms-error" />
                </div>
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
                className="font-medium text-icambio-primary hover:text-icambio-primary/80 transition-colors underline-offset-4 hover:underline"
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