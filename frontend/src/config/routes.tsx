import { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/static/AboutPage';
import { RulesPage } from '@/pages/static/RulesPage';
import { AMLKYCPage } from '@/pages/static/AMLKYCPage';
import { authRoutes } from '@/features/auth/routes';
import { exchangeRoutes } from '@/features/exchange/routes';
import { profileRoutes } from '@/features/profile/routes';

// Основные маршруты
const mainRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'about', element: <AboutPage /> },
  { path: 'rules', element: <RulesPage /> },
  { path: 'aml-kyc', element: <AMLKYCPage /> },
];

// Объединяем все маршруты
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [...mainRoutes, ...authRoutes, ...exchangeRoutes, ...profileRoutes],
  },
  // Маршрут 404
  {
    path: '*',
    element: <div>Страница не найдена</div>,
  },
];
