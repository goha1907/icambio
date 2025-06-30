import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { profileSchema, ProfileFormData } from '@/shared/validation/profile';
import type { TUser } from '@/types';
import { Edit3, Save, X, MapPin } from 'lucide-react';

interface ProfileDetailsProps {
  user: TUser;
}

export const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { updateProfile, isLoading } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user.email || '',
      username: user.username || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      whatsapp: user.whatsapp || '',
      telegram: user.telegram || '',
      preferred_delivery_address: user.preferred_delivery_address || '',
    },
  });

  const { watch, handleSubmit, reset, formState: { errors } } = form;
  const watchedValues = watch();

  // Отслеживаем изменения в форме
  useEffect(() => {
    if (!isEditing) return;

    const currentValues = {
      email: user.email || '',
      username: user.username || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      whatsapp: user.whatsapp || '',
      telegram: user.telegram || '',
      preferred_delivery_address: user.preferred_delivery_address || '',
    };

    const hasChanged = Object.keys(currentValues).some(
      key => currentValues[key as keyof typeof currentValues] !== watchedValues[key as keyof typeof watchedValues]
    );

    setHasChanges(hasChanged);
  }, [watchedValues, user, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHasChanges(false);
    reset({
      email: user.email || '',
      username: user.username || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      whatsapp: user.whatsapp || '',
      telegram: user.telegram || '',
      preferred_delivery_address: user.preferred_delivery_address || '',
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Профиль успешно обновлен!');
        setIsEditing(false);
        setHasChanges(false);
      }
    } catch (error) {
      toast.error('Произошла ошибка при сохранении');
    }
  };

  const renderField = (
    label: string,
    name: keyof ProfileFormData,
    value: string,
    placeholder?: string,
    icon?: React.ReactNode
  ) => {
    if (isEditing) {
      return (
        <div className="space-y-1">
          <Label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-1">
            {icon}
            {label}
          </Label>
          <Input
            id={name}
            placeholder={placeholder}
            {...form.register(name)}
            className={errors[name] ? 'border-red-500' : ''}
          />
          {errors[name] && (
            <p className="text-red-500 text-xs">{errors[name]?.message}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
          {icon}
          {label}
        </Label>
        <p className="text-gray-900 min-h-[1.25rem]">
          {value || '-'}
        </p>
      </div>
    );
  };

  const renderContactField = (
    label: string,
    name: keyof ProfileFormData,
    value: string,
    linkPrefix: string,
    placeholder?: string
  ) => {
    if (isEditing) {
      return renderField(label, name, value, placeholder);
    }

    return (
      <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-500">{label}</Label>
        <p className="text-gray-900 min-h-[1.25rem]">
          {value ? (
            <a 
              href={value.startsWith('https://') ? value : `${linkPrefix}${value.replace(/[@+]/g, '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-icmop-primary hover:underline"
            >
              {value}
            </a>
          ) : '-'}
        </p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-icmop-primary to-icmop-dark bg-clip-text text-transparent">
            Информация профиля
          </CardTitle>
          {!isEditing && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleEdit}
              className="text-icmop-primary hover:bg-icmop-primary/10"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Редактировать данные
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('Email', 'email', user.email)}
            {renderField('Никнейм', 'username', user.username || '', 'your_username')}
            {renderField('Имя', 'first_name', user.first_name || '', 'Иван')}
            {renderField('Фамилия', 'last_name', user.last_name || '', 'Иванов')}
            {renderContactField('WhatsApp', 'whatsapp', user.whatsapp || '', 'https://wa.me/', '+79991234567')}
            {renderContactField('Telegram', 'telegram', user.telegram || '', 'https://t.me/', '@your_telegram')}
          </div>

          {/* Предпочитаемый адрес доставки - на всю ширину */}
          <div className="border-t pt-6">
            {renderField(
              'Предпочитаемый адрес доставки', 
              'preferred_delivery_address', 
              user.preferred_delivery_address || '', 
              'г. Буэнос-Айрес, ул. Примерная, д. 123, кв. 45',
              <MapPin className="w-4 h-4" />
            )}
            {!isEditing && (
              <p className="text-xs text-gray-500 mt-1">
                Этот адрес будет автоматически подставляться при создании заказов с доставкой
              </p>
            )}
          </div>

          {/* Кнопки управления */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button"
                variant="ghost" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Отмена
              </Button>
              <Button 
                type="submit"
                disabled={!hasChanges || isLoading}
                className="bg-icmop-primary hover:bg-icmop-dark"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Сохранение...' : 'Сохранить данные'}
          </Button>
        </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
