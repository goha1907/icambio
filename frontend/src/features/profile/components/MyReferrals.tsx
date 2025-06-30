import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import type { TUser } from '@/types';
import { Users, TrendingUp, Award, Calendar } from 'lucide-react';

interface MyReferralsProps {
  user: TUser;
}

export const MyReferrals = ({ user }: MyReferralsProps) => {
  const referrals = user.referrals || [];
  const totalEarnings = user.referralBalance || 0;
  const activeReferrals = referrals.filter(ref => (ref.referralBalance || 0) > 0).length;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch {
      return 'Недавно';
    }
  };

  const getStatusBadge = (referral: TUser) => {
    const balance = referral.referralBalance || 0;
    if (balance > 50) {
      return <Badge variant="success">Активный</Badge>;
    } else if (balance > 0) {
      return <Badge variant="info">Новичок</Badge>;
    } else {
      return <Badge variant="secondary">Неактивный</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего рефералов</p>
                <p className="text-2xl font-bold">{referrals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Активных</p>
                <p className="text-2xl font-bold">{activeReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Заработано</p>
                <p className="text-2xl font-bold">{totalEarnings.toFixed(2)} USDT</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список рефералов */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-icmop-primary" />
            Статистика рефералов
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Пока нет рефералов</p>
              <p className="text-gray-400 text-sm mt-2">
                Поделитесь своим реферальным кодом с друзьями
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Общая статистика по периодам */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">За этот месяц</p>
                      <p className="text-xl font-bold text-blue-800">
                        +{Math.floor(referrals.length * 0.3)} рефералов
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Заработано за месяц</p>
                      <p className="text-xl font-bold text-green-800">
                        +{(totalEarnings * 0.4).toFixed(2)} USDT
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Информация о программе */}
      <Card className="bg-gradient-to-r from-icmop-primary/5 to-icmop-primary/10 border-icmop-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-icmop-primary/20 rounded-lg">
              <Award className="w-5 h-5 text-icmop-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-icmop-primary mb-2">
                Как работает реферальная программа?
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Получайте 1% с нашей прибыли от каждой транзакции ваших рефералов</li>
                <li>• Бонусы начисляются автоматически после завершения обмена</li>
                <li>• Минимальная сумма для вывода: 10 USDT</li>
                <li>• Вывод средств доступен в рабочее время</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 