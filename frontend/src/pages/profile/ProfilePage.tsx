import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ProfileDetails } from '@/features/profile/components/ProfileDetails';
import { ExchangeHistory } from '@/features/profile/components/ExchangeHistory';
import { ReferralProgram } from '@/features/profile/components/ReferralProgram';
import { TabPanel } from '@/shared/ui/TabPanel';
import { PageTitle } from '@/shared/ui/PageTitle';

export const ProfilePage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = new URLSearchParams(location.search).get('tab') || 'profile';

  const handleTabChange = (tabId: string) => {
    navigate(`/profile?tab=${tabId}`, { replace: true });
  };

  console.log('ProfilePage: Rendering with user:', user?.email);

  // Поскольку страница защищена AuthGuard, пользователь точно авторизован
  if (!user) {
    return (
      <div className="page-container">
        <div className="flex justify-center items-center min-h-64">
          <p>Ошибка загрузки профиля</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'profile',
      label: 'Профиль',
      content: <ProfileDetails user={user} />,
    },
    {
      id: 'history',
      label: 'История обменов',
      content: <ExchangeHistory exchanges={[]} />,
    },
    {
      id: 'referral',
      label: 'Реферальная программа',
      content: <ReferralProgram user={user} />,
    },
  ];

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <PageTitle title="Личный кабинет" description="Управление профилем и история обменов" />

        <TabPanel tabs={tabs} defaultTab={activeTab} onChange={handleTabChange} />
      </div>
    </div>
  );
}; 