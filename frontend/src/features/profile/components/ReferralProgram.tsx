import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useNotification } from '@/lib/hooks/useNotification';
import type { User } from '@/types';
import { Copy } from 'lucide-react';

interface ReferralProgramProps {
  user: User;
}

export const ReferralProgram = ({ user }: ReferralProgramProps) => {
  const navigate = useNavigate();
  const { success } = useNotification();
  const [copying, setCopying] = useState(false);

  const handleCopyLink = async () => {
    if (user.referralLink) {
      try {
        setCopying(true);
        await navigator.clipboard.writeText(user.referralLink);
        success('Реферальная ссылка скопирована');
      } catch (err) {
      } finally {
        setCopying(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Реферальная программа</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-500">Реферальная ссылка</label>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex-1 p-2 bg-gray-50 rounded-md text-sm truncate">
              {user.referralLink}
            </div>
            {/* <Button
              variant="secondary"
              onClick={handleCopyLink}
              disabled={copying}
            >
              {copying ? 'Копирование...' : 'Копировать'}
            </Button> */}
            <Button
              variant="secondary"
              onClick={handleCopyLink}
              disabled={copying || !user.referralLink}
              className="copy-button"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copying ? 'Копирование...' : 'Копировать'}
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Бонусный баланс</label>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xl font-semibold">{user.referralBalance || 0} USDT</span>
            <Button
              variant="primary"
              onClick={() => navigate('/profile/withdraw')}
              disabled={!user.referralBalance || user.referralBalance <= 0}
            >
              Вывод средств
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
