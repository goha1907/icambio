import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from '@/shared/validation/auth';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/Alert';
import { Link } from '@/shared/ui/Link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/Form';
import { Input } from '@/shared/ui/Input';

export const ResetPasswordForm = () => {
  const { resetPassword, isLoading } = useAuth();
  const [error] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    void resetPassword(data.email);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Сброс пароля
          </h2>
          <p className="text-gray-600 mb-8">
            Введите ваш email, и мы вышлем инструкцию
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Отправка...' : 'Сбросить пароль'}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <Link to="/login" size="sm">
            Вернуться ко входу
          </Link>
        </div>
      </div>
    </div>
  );
};
