import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/layouts/components/Header';
import { Main } from '@/layouts/components/Main';
import { Footer } from '@/layouts/components/Footer';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};
