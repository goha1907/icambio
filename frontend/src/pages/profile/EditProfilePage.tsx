import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  profileSchema,
  ProfileFormData,
} from '@/shared/validation/profile';
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
import { PageTitle } from '@/shared/ui/PageTitle';

export const EditProfilePage = () => {
  const { user, updateProfile, isLoading } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      username: user?.username || '',
      whatsapp: user?.whatsapp || '',
      telegram: user?.telegram || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    const result = await updateProfile(data);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Профиль успешно обновлен!');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <PageTitle title="Редактирование профиля" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 max-w-lg mx-auto space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя пользователя</FormLabel>
                <FormControl>
                  <Input placeholder="yourname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Иван" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фамилия</FormLabel>
                <FormControl>
                  <Input placeholder="Иванов" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="+79991234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram</FormLabel>
                <FormControl>
                  <Input placeholder="@your_telegram" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </form>
      </Form>
    </div>
  );
}; 