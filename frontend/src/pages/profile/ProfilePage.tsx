// frontend/src/pages/profile/ProfilePage.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ProfileDetails } from '@/components/profile/ProfileDetails';
import { ExchangeHistory } from '@/components/profile/ExchangeHistory';
import { ReferralProgram } from '@/components/profile/ReferralProgram';
import { TabPanel } from '@/components/common/TabPanel';
import { PageTitle } from '@/components/common/PageTitle';

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
      content: <ProfileDetails user={user} />
    },
    {
      id: 'history',
      label: 'История обменов',
      content: <ExchangeHistory exchanges={[]} />
    },
    {
      id: 'referral',
      label: 'Реферальная программа',
      content: <ReferralProgram user={user} />
    }
  ];

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <PageTitle 
          title="Личный кабинет"
          description="Управление профилем и история обменов"
        />
        
        <TabPanel 
          tabs={tabs} 
          defaultTab={activeTab}
          onChange={handleTabChange}
        />
      </div>
    </div>
  );
};