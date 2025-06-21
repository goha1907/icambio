import { RouteObject } from 'react-router-dom';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { EditProfilePage } from '@/pages/profile/EditProfilePage';

export const profileRoutes: RouteObject[] = [
  {
    path: 'profile',
    element: <ProfilePage />,
  },
  {
    path: 'profile/edit',
    element: <EditProfilePage />,
  },
];
