import { RouteObject } from 'react-router-dom';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { EditProfilePage } from '@/pages/profile/EditProfilePage';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';

export const profileRoutes: RouteObject[] = [
  {
    path: 'profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'profile/edit',
    element: (
      <ProtectedRoute>
        <EditProfilePage />
      </ProtectedRoute>
    ),
  },
];
