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

  // Получаем активную вкладку из URL или используем 'profile' по умолчанию
  const activeTab = new URLSearchParams(location.search).get('tab') || 'profile';

  // При изменении вкладки обновляем URL
  const handleTabChange = (tabId: string) => {
    navigate(`/profile?tab=${tabId}`, { replace: true });
  };

  // Если пользователь не авторизован, нет смысла рендерить страницу
  if (!user) return null;

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
