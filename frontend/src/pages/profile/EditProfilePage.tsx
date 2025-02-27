// frontend/src/pages/profile/EditProfilePage.tsx
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/hooks/useNotification';
import { PageTitle } from '@/components/common/PageTitle';
import { profileAPI } from '@/api/services/profile';
import { profileSchema, ProfileFormData } from '@/lib/validations/profile';

export const EditProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      whatsapp: user?.whatsapp || '',
      telegram: user?.telegram || ''
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Вызов API для обновления профиля
      await profileAPI.updateProfile(data);
      success('Профиль успешно обновлен');
      navigate('/profile');
    } catch (err: any) {
      error(err.response?.data?.message || 'Не удалось обновить профиль');
    }
  };

  if (!user) return null;

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        <PageTitle 
          title="Редактирование профиля"
          description="Измените ваши личные данные"
        />

        <Card>
          <CardHeader>
            <CardTitle>Личные данные</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Неизменяемое поле */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{user.email}</p>
                  </div>
                </div>

                {/* Редактируемые поля */}
                  <Input
                    label="Никнейм"
                    {...register('username')}
                    error={errors.username?.message}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Имя"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                />
                <Input
                  label="Фамилия"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="WhatsApp"
                  placeholder="+79123456789"
                  {...register('whatsapp')}
                  error={errors.whatsapp?.message}
                />
                <Input
                  label="Telegram"
                  placeholder="@username"
                  {...register('telegram')}
                  error={errors.telegram?.message}
                />
              </div>

              <div className="flex justify-between space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/profile')}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
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