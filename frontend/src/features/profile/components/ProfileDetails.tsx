import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
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
            <p className="mt-1">{user.first_name || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Фамилия</label>
            <p className="mt-1">{user.last_name || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">WhatsApp</label>
            <p className="mt-1">
              {user.whatsapp ? (
                <a 
                  href={user.whatsapp.startsWith('https://') ? user.whatsapp : `https://wa.me/${user.whatsapp.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {user.whatsapp.startsWith('https://') ? user.whatsapp.replace('https://wa.me/', '') : user.whatsapp}
                </a>
              ) : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Telegram</label>
            <p className="mt-1">
              {user.telegram ? (
                <a 
                  href={user.telegram.startsWith('https://') ? user.telegram : `https://t.me/${user.telegram.replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {user.telegram.startsWith('https://') ? user.telegram.replace('https://t.me/', '@') : user.telegram}
                </a>
              ) : '-'}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={() => navigate('/profile/edit')}>
            Редактировать данные
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
