import { RouteObject } from 'react-router-dom';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { ChangePasswordPage } from '@/pages/auth/ChangePasswordPage';

export const profileRoutes: RouteObject[] = [
  {
    path: 'profile',
    element: <ProfilePage />,
  },
  {
    path: 'change-password',
    element: <ChangePasswordPage />,
  },
];
