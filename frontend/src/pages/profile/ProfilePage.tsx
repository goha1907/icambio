import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PageTitle } from '@/shared/ui/PageTitle';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/TabPanel';
import { ProfileDetails } from '@/features/profile/components/ProfileDetails';
import { ExchangeHistory } from '@/features/profile/components/ExchangeHistory';
import { ReferralProgram } from '@/features/profile/components/ReferralProgram';
import { MOCK_EXCHANGE_HISTORY } from '@/lib/mock-data';

export const ProfilePage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = new URLSearchParams(location.search).get('tab') || 'profile';

  const handleTabChange = (tabId: string) => {
    navigate(`/profile?tab=${tabId}`, { replace: true });
  };

  if (!user) {
    // Можно заменить на более красивый скелет загрузки
    return <div>Загрузка профиля...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <PageTitle title="Личный кабинет" />
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-6"
      >
        <TabsList>
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="history">История обменов</TabsTrigger>
          <TabsTrigger value="referral">Реферальная программа</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileDetails user={user} />
        </TabsContent>
        <TabsContent value="history">
          <ExchangeHistory exchanges={MOCK_EXCHANGE_HISTORY} />
        </TabsContent>
        <TabsContent value="referral">
          <ReferralProgram user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 