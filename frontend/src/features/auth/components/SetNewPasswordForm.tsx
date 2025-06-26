import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

export const SetNewPasswordForm = () => {
  const navigate = useNavigate();
  const { changePassword, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SetNewPasswordFormData>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SetNewPasswordFormData) => {
    setError(null);
    const result = await changePassword(data.password);
    if (result.error) {
      setError(result.error);
    } else {
      toast.success('Пароль успешно установлен!');
      navigate('/login');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && <p className="text-destructive text-sm">{error}</p>}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Новый пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтвердите пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Сохранение...' : 'Сохранить пароль'}
        </Button>
      </form>
    </Form>
  );
}; 