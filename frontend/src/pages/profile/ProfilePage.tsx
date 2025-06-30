import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  History, 
  Users, 
  Settings, 
  CreditCard, 
  Shield, 
  Bell,
  TrendingUp,
  Award,
  Calendar,
  Eye,
  EyeOff,
  Edit3,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/TabPanel';
import { ProfileDetails } from '@/features/profile/components/ProfileDetails';
import { ExchangeHistory } from '@/features/profile/components/ExchangeHistory';
import { ReferralProgram } from '@/features/profile/components/ReferralProgram';
import { MyReferrals } from '@/features/profile/components/MyReferrals';
import { MOCK_EXCHANGE_HISTORY, MOCK_USER_PROFILES } from '@/lib/mock-data';

/**
 * Главная страница профиля пользователя
 * 
 * Отвечает за:
 * - Отображение основной информации о пользователе
 * - Статистику активности и баланса
 * - Навигацию между разделами профиля
 * - Быстрые действия пользователя
 * - Уведомления и настройки
 */
export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);

  const activeTab = new URLSearchParams(location.search).get('tab') || 'profile';

  const handleTabChange = (tabId: string) => {
    navigate(`/profile?tab=${tabId}`, { replace: true });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50 text-center max-w-md w-full mx-4">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 animate-pulse">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Загрузка профиля
          </h2>
          <p className="text-muted-foreground">
            Получаем информацию о вашем аккаунте...
          </p>
        </div>
      </div>
    );
  }

  // В разработке используем моковые данные для реферальной системы
  const mockUser = MOCK_USER_PROFILES[0]; // John Doe с рефералами
  const userWithReferralData = {
    ...user,
    referral_code: mockUser.referral_code,
    referral_link: mockUser.referral_link,
    referralBalance: mockUser.referralBalance,
    referrals: mockUser.referrals,
    invited_by_code: mockUser.invited_by_code,
  };

  // Вычисляем статистику пользователя
  const userStats = {
    totalExchanges: MOCK_EXCHANGE_HISTORY.length,
    totalVolume: MOCK_EXCHANGE_HISTORY.reduce((sum, exchange) => sum + exchange.amount_from, 0),
    successRate: Math.round((MOCK_EXCHANGE_HISTORY.filter(e => e.status === 'completed').length / MOCK_EXCHANGE_HISTORY.length) * 100),
    memberSince: new Date(user.created_at || Date.now()),
    referralEarnings: userWithReferralData.referralBalance || 0,
    activeReferrals: userWithReferralData.referrals?.filter(r => r.status === 'active').length || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unverified': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserLevel = (totalExchanges: number) => {
    if (totalExchanges >= 100) return { level: 'VIP', color: 'text-purple-600', icon: '👑' };
    if (totalExchanges >= 50) return { level: 'Gold', color: 'text-yellow-600', icon: '🥇' };
    if (totalExchanges >= 20) return { level: 'Silver', color: 'text-gray-600', icon: '🥈' };
    if (totalExchanges >= 5) return { level: 'Bronze', color: 'text-amber-600', icon: '🥉' };
    return { level: 'Новичок', color: 'text-blue-600', icon: '🌟' };
  };

  const userLevel = getUserLevel(userStats.totalExchanges);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto max-w-7xl py-8 px-4">
        {/* Шапка профиля */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white relative">
              {/* Декоративные элементы */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  {/* Аватар */}
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {user.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  
                  {/* Основная информация */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h1 className="text-2xl font-bold">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : user.username || 'Пользователь'
                        }
                      </h1>
                      <span className="text-lg">{userLevel.icon}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-white/90">
                      <span className={`font-medium ${userLevel.color.replace('text-', 'text-white/')}`}>
                        {userLevel.level}
                      </span>
                      <Badge className={getStatusColor('verified')}>
                        <Shield className="w-3 h-3 mr-1" />
                        Верифицирован
                      </Badge>
                      <span className="text-sm">
                        С нами с {userStats.memberSince.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Быстрые действия */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => handleTabChange('profile')}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Статистика */}
            <CardContent className="px-6 py-4 bg-white/50">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.totalExchanges}</div>
                  <div className="text-xs text-muted-foreground">Обменов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {showBalance ? `$${userStats.totalVolume.toLocaleString()}` : '***'}
                  </div>
                  <div className="text-xs text-muted-foreground">Объем</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{userStats.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Успешность</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {showBalance ? `$${userStats.referralEarnings}` : '***'}
                  </div>
                  <div className="text-xs text-muted-foreground">Заработано</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{userStats.activeReferrals}</div>
                  <div className="text-xs text-muted-foreground">Рефералов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">A+</div>
                  <div className="text-xs text-muted-foreground">Рейтинг</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Быстрые действия */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/exchange')}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-sm">Новый обмен</h3>
              <p className="text-xs text-muted-foreground">Обменять валюту</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTabChange('history')}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <History className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-sm">История</h3>
              <p className="text-xs text-muted-foreground">Мои операции</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTabChange('referral')}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-sm">Рефералы</h3>
              <p className="text-xs text-muted-foreground">Пригласить друзей</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-sm">Настройки</h3>
              <p className="text-xs text-muted-foreground">Безопасность</p>
            </CardContent>
          </Card>
        </div>

        {/* Основной контент с табами */}
        <Card>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
            className="w-full"
          >
            <CardHeader className="pb-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Профиль</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center space-x-2">
                  <History className="h-4 w-4" />
                  <span>История обменов</span>
                </TabsTrigger>
                <TabsTrigger value="referral" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Реферальная программа</span>
                </TabsTrigger>
                <TabsTrigger value="my-referrals" className="flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Мои рефералы</span>
                </TabsTrigger>
        </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="profile" className="mt-0">
          <ProfileDetails user={user} />
        </TabsContent>
              
              <TabsContent value="history" className="mt-0">
          <ExchangeHistory exchanges={MOCK_EXCHANGE_HISTORY} />
        </TabsContent>
              
              <TabsContent value="referral" className="mt-0">
                <ReferralProgram user={userWithReferralData} />
              </TabsContent>
              
              <TabsContent value="my-referrals" className="mt-0">
                <MyReferrals user={userWithReferralData} />
        </TabsContent>
            </CardContent>
      </Tabs>
        </Card>

        {/* Дополнительная информация */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Уведомления и новости */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span>Уведомления</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Новые курсы валют</p>
                    <p className="text-xs text-blue-600">Обновлены курсы USD/RUB и EUR/RUB</p>
                    <p className="text-xs text-blue-500 mt-1">2 часа назад</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Реферальный бонус</p>
                    <p className="text-xs text-green-600">Получен бонус за нового реферала</p>
                    <p className="text-xs text-green-500 mt-1">1 день назад</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-purple-800">Повышение статуса</p>
                    <p className="text-xs text-purple-600">Поздравляем с достижением уровня {userLevel.level}!</p>
                    <p className="text-xs text-purple-500 mt-1">3 дня назад</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Безопасность и настройки */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Безопасность</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Email подтвержден</p>
                      <p className="text-xs text-green-600">Ваш email адрес верифицирован</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">✓</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">2FA не настроена</p>
                      <p className="text-xs text-yellow-600">Рекомендуем включить для защиты</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Настроить
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Последний вход</p>
                      <p className="text-xs text-blue-600">Сегодня в 14:30</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 