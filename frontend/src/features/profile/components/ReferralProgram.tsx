import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import type { TUser } from '@/types';
import { Copy, Link2, Users, Wallet, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { findUserByReferralCode } from '@/lib/mock-data';
import { useNavigate } from 'react-router-dom';

interface ReferralProgramProps {
  user: TUser;
}

export const ReferralProgram = ({ user }: ReferralProgramProps) => {
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foundUser, setFoundUser] = useState<string | null>(null);

  const handleCopyLink = async () => {
    if (user.referral_link) {
      try {
        setCopying(true);
        await navigator.clipboard.writeText(user.referral_link);
        toast.success('Реферальная ссылка скопирована!');
      } catch (err) {
        toast.error('Не удалось скопировать ссылку');
      } finally {
        setCopying(false);
      }
    }
  };

  const handleGoToMyReferrals = () => {
    // Переходим на вкладку "Мои рефералы" в том же профиле
    navigate('/profile?tab=my-referrals');
  };

  const handleSubmitReferralCode = async () => {
    if (!referralCode.trim()) {
      toast.error('Введите реферальный код');
      return;
    }

    if (referralCode === user.referral_code) {
      toast.error('Нельзя использовать свой собственный код');
      return;
    }

    if (user.invited_by_code) {
      toast.error('Вы уже являетесь рефералом');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const inviterUser = findUserByReferralCode(referralCode);
      
      if (!inviterUser) {
        toast.error('Реферальный код не найден');
        return;
      }

      // В реальном приложении здесь будет API запрос на обновление пользователя
      setFoundUser(inviterUser.email);
      toast.success(`Вы успешно стали рефералом пользователя ${inviterUser.email}!`);
      setReferralCode('');
      
    } catch (error) {
      toast.error('Произошла ошибка при обработке кода');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Основная карточка реферальной программы */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-icmop-primary" />
            Реферальная программа
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Мой реферальный код */}
          <div>
            <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Ваш реферальный код
            </Label>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <code 
                  className="text-2xl font-mono font-bold text-icmop-primary cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleCopyLink}
                  title="Нажмите, чтобы скопировать ссылку"
                >
                  {user.referral_code}
                </code>
                <span 
                  className="text-sm text-gray-500 cursor-pointer hover:text-icmop-primary transition-colors"
                  onClick={handleGoToMyReferrals}
                  title="Перейти к списку рефералов"
                >
                  (Мои рефералы: {user.referrals?.length || 0})
                </span>
              </div>
              <Button
                variant="secondary"
                onClick={handleCopyLink}
                disabled={copying}
                className="shrink-0 min-w-[140px]"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copying ? 'Скопировано!' : 'Копировать ссылку'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Поделитесь этим кодом с друзьями
            </p>
          </div>

          {/* Бонусный баланс */}
          <div>
            <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Бонусный баланс
            </Label>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {user.referralBalance.toFixed(2)} USDT
                </span>
              </div>
              <Button
                variant="primary"
                disabled={user.referralBalance <= 0}
                className="opacity-50 cursor-not-allowed shrink-0 min-w-[140px]"
                title="Функция вывода средств в разработке"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Вывод средств
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Функция вывода средств временно недоступна
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Карточка для ввода реферального кода */}
      {!user.invited_by_code && !foundUser && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Стать рефералом</CardTitle>
            <p className="text-sm text-gray-600">
              Если у вас есть реферальный код от друга, введите его ниже
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="referral-code">Реферальный код</Label>
              <div className="mt-2 flex gap-3">
                <Input
                  id="referral-code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="Например: REF123ABC"
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Button
                  onClick={handleSubmitReferralCode}
                  disabled={isSubmitting || !referralCode.trim()}
                  variant="primary"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Проверяем...
                    </>
                  ) : (
                    'Применить'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Статус реферала */}
      {(user.invited_by_code || foundUser) && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  Вы являетесь рефералом
                </p>
                <p className="text-sm text-green-600">
                  Код: <code className="font-mono font-bold">{user.invited_by_code || referralCode}</code>
                  {foundUser && ` • Пригласил: ${foundUser}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
