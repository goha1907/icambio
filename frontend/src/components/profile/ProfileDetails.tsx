// frontend/src/components/profile/ProfileDetails.tsx
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types';

interface ProfileDetailsProps {
  user: User;
}

export const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Информация профиля</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Никнейм</label>
            <p className="mt-1">{user.username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Имя</label>
            <p className="mt-1">{user.firstName || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Фамилия</label>
            <p className="mt-1">{user.lastName || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">WhatsApp</label>
            <p className="mt-1">{user.whatsapp || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Telegram</label>
            <p className="mt-1">{user.telegram || '-'}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            variant="primary"
            onClick={() => navigate('/profile/edit')}
          >
            Редактировать данные
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};