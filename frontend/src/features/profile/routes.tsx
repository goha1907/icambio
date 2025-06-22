import { RouteObject } from 'react-router-dom';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { EditProfilePage } from '@/pages/profile/EditProfilePage';
import { ChangePasswordPage } from '@/pages/auth/ChangePasswordPage';

export const profileRoutes: RouteObject[] = [
  {
    path: 'profile',
    element: <ProfilePage />,
  },
  {
    path: 'profile/edit',
    element: <EditProfilePage />,
  },
  {
    path: 'change-password',
    element: <ChangePasswordPage />,
  },
];
