import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@/shared/validation/profile';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { PageTitle } from '@/shared/ui/PageTitle';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { ProfileUpdateData } from '@/types';

const formatWhatsApp = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('https://wa.me/')) {
    return url.replace('https://wa.me/', '');
  }
  return url;
};

const formatTelegram = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('https://t.me/')) {
    return '@' + url.replace('https://t.me/', '');
  }
  if (!url.startsWith('@') && url !== '') {
    return '@' + url;
  }
  return url;
};

export const EditProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      whatsapp: formatWhatsApp(user?.whatsapp),
      telegram: formatTelegram(user?.telegram),
    },
  });

  const { handleSubmit, isSubmitting } = useFormSubmit<ProfileUpdateData>({
    onSubmit: async (data) => {
      if (!user) return; // Необходимо, чтобы пользователь существовал

      const formatted = {
        ...data,
        whatsapp: data.whatsapp
          ? data.whatsapp.startsWith('https://')
            ? data.whatsapp
            : `https://wa.me/${data.whatsapp.replace(/\D/g, '')}`
          : '',
        telegram: data.telegram
          ? data.telegram.startsWith('https://')
            ? data.telegram
            : `https://t.me/${data.telegram.replace('@', '')}`
          : '',
      };
      await updateProfile(user.id, formatted);
    },
    successMessage: 'Профиль успешно обновлен',
    errorMessage: 'Не удалось обновить профиль',
  });

  if (!user) return null;

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        <PageTitle title="Редактирование профиля" description="Измените ваши личные данные" />

        <Card>
          <CardHeader>
            <CardTitle>Личные данные</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{user.email}</p>
                  </div>
                </div>

                <Input label="Никнейм" {...register('username')} error={errors.username?.message} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Имя" {...register('first_name')} error={errors.first_name?.message} />
                <Input label="Фамилия" {...register('last_name')} error={errors.last_name?.message} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="WhatsApp"
                  placeholder="+79123456789"
                  {...register('whatsapp')}
                  error={errors.whatsapp?.message}
                  helperText="Введите номер телефона с кодом страны"
                />
                <Input
                  label="Telegram"
                  placeholder="@username"
                  {...register('telegram')}
                  error={errors.telegram?.message}
                  helperText="Введите ваш @username в Telegram"
                />
              </div>

              <div className="flex justify-between space-x-4">
                <Button type="button" variant="secondary" onClick={() => navigate('/profile')}>
                  Отмена
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 