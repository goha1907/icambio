import { useState, useMemo } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { MOCK_ORDERS_DB, MOCK_CURRENCIES_DB, MOCK_USERS_DB } from '@/shared/lib/mock-data-db';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/TabPanel';
import { ProfileDetails } from '@/features/profile/components/ProfileDetails';
import { ExchangeHistory } from '@/features/profile/components/ExchangeHistory';
import { ReferralProgram } from '@/features/profile/components/ReferralProgram';
import { MyReferrals } from '@/features/profile/components/MyReferrals';
import { UserMenu } from '@/features/profile/components/UserMenu';
import { 
  User, 
  Wallet, 
  History, 
  Users, 
  Settings,
  TrendingUp,
  Star
} from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  // Получаем данные пользователя из моков
  const userWithReferralData = useMemo(() => {
    if (!user?.id) return null;
    
    const userData = MOCK_USERS_DB.find(u => u.id === user.id);
    if (!userData) return null;

    // Получаем рефералов пользователя
    const referrals = MOCK_USERS_DB.filter(u => u.referred_by_code === userData.referral_code);
    
    // Получаем заказы пользователя
    const orders = MOCK_ORDERS_DB.filter(o => o.user_id === user.id);
    
    return {
      ...userData,
      referrals,
      orders,
      activeReferrals: referrals.length,
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      referralBalance: 0 // Временно устанавливаем 0, позже будет из БД
    };
  }, [user?.id]);

  // Преобразуем заказы в формат для ExchangeHistory
  const exchangeHistory = useMemo(() => {
    if (!userWithReferralData?.orders) return [];
    
    return userWithReferralData.orders.map(order => {
      const fromCurrency = MOCK_CURRENCIES_DB.find(c => c.id === order.currency_from_id);
      const toCurrency = MOCK_CURRENCIES_DB.find(c => c.id === order.currency_to_id);
      
      return {
        id: order.id,
        date: order.created_at,
        fromCurrency: fromCurrency?.code || '',
        toCurrency: toCurrency?.code || '',
        fromAmount: order.amount_from,
        toAmount: order.amount_to,
        status: order.status as 'completed' | 'pending' | 'cancelled',
        hasReview: false, // Пока не реализовано
        pairs: [{
          fromCurrency: fromCurrency?.code || '',
          toCurrency: toCurrency?.code || '',
          amount: order.amount_from,
          result: order.amount_to
        }]
      };
    });
  }, [userWithReferralData?.orders]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Необходима авторизация
          </h1>
          <p className="text-gray-600">
            Пожалуйста, войдите в систему для доступа к профилю
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
          {/* Заголовок профиля */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-icambio-primary rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userWithReferralData?.first_name} {userWithReferralData?.last_name}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {userWithReferralData?.role || 'user'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      ID: {user.id}
                    </span>
                  </div>
                </div>
              </div>
              <UserMenu user={user} />
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userWithReferralData?.totalOrders || 0}
                  </div>
                  <div className="text-sm text-gray-600">Всего заказов</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userWithReferralData?.completedOrders || 0}
                  </div>
                  <div className="text-sm text-gray-600">Завершенных</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userWithReferralData?.activeReferrals || 0}
                  </div>
                  <div className="text-sm text-gray-600">Рефералов</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userWithReferralData?.referralBalance?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-gray-600">Бонусов USDT</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Табы */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                История
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Рефералы
              </TabsTrigger>
              <TabsTrigger value="program" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Программа
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileDetails user={user} />
            </TabsContent>

            <TabsContent value="history">
              <ExchangeHistory exchanges={exchangeHistory} />
            </TabsContent>

            <TabsContent value="referrals">
              <MyReferrals user={user} />
            </TabsContent>

            <TabsContent value="program">
              <ReferralProgram user={user} />
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
}; 