import { RouteObject } from 'react-router-dom';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { EditProfilePage } from '@/features/profile/pages/EditProfilePage';
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
