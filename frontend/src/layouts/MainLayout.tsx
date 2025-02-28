import { Outlet } from 'react-router-dom';
import { Header } from '@/layouts/components/Header';
import { Main } from '@/layouts/components/Main';
import { Footer } from '@/layouts/components/Footer';

export const MainLayout = () => {
  return (
    <div className="layout-container">
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
};
