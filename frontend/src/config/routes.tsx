import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Loader } from '@/shared/ui/Loader';
import { AuthGuard } from '@/shared/ui/ProtectedRoute';
import { authRoutes } from '@/features/auth/routes';
import { exchangeRoutes } from '@/features/exchange/routes';
import { profileRoutes } from '@/features/profile/routes';

// Отложенная загрузка страниц
const HomePage = lazy(() => import('../pages/HomePage').then(module => ({ default: module.HomePage })));
const AboutPage = lazy(() => import('../pages/static/AboutPage').then(module => ({ default: module.AboutPage })));
const RulesPage = lazy(() => import('../pages/static/RulesPage').then(module => ({ default: module.RulesPage })));
const AMLKYCPage = lazy(() => import('../pages/static/AMLKYCPage').then(module => ({ default: module.AMLKYCPage })));
const RatesPage = lazy(() => import('../pages/static/RatesPage').then(module => ({ default: module.RatesPage })));
const ReviewsPage = lazy(() => import('../pages/static/ReviewsPage').then(module => ({ default: module.ReviewsPage })));
const DeliveryPage = lazy(() => import('../pages/static/DeliveryPage').then(module => ({ default: module.DeliveryPage })));
const WorkingHoursPage = lazy(() => import('../pages/static/WorkingHoursPage').then(module => ({ default: module.WorkingHoursPage })));
const EmailConfirmedPage = lazy(() => import('../pages/auth/EmailConfirmedPage').then(module => ({ default: module.EmailConfirmedPage })));

// Компонент для оборачивания отложенной загрузки
const LazyComponent = ({ component: Component }: { component: React.ComponentType<any> }) => (
  <Suspense fallback={<Loader fullScreen />}>
    <Component />
  </Suspense>
);

// Основные маршруты (публичные)
const mainRoutes: RouteObject[] = [
  { index: true, element: <LazyComponent component={HomePage} /> },
  { path: 'about', element: <LazyComponent component={AboutPage} /> },
  { path: 'rules', element: <LazyComponent component={RulesPage} /> },
  { path: 'aml-kyc', element: <LazyComponent component={AMLKYCPage} /> },
  { path: 'rates', element: <LazyComponent component={RatesPage} /> },
  { path: 'reviews', element: <LazyComponent component={ReviewsPage} /> },
  { path: 'delivery', element: <LazyComponent component={DeliveryPage} /> },
  { path: 'working-hours', element: <LazyComponent component={WorkingHoursPage} /> },
  { path: 'email-confirmed', element: <LazyComponent component={EmailConfirmedPage} /> },
];

// Защищенные маршруты
const protectedRoutes: RouteObject[] = [
  {
    path: '',
    element: <AuthGuard />,
    children: [...exchangeRoutes, ...profileRoutes],
  },
];

// Объединяем все маршруты
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [...mainRoutes, ...authRoutes, ...protectedRoutes],
  },
  // Маршрут 404
  {
    path: '*',
    element: <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600">Страница не найдена</p>
      </div>
    </div>,
  },
];
