// frontend/src/api/services/profile.ts
import api from '@/api/config/axios';
import { User, ProfileUpdateData } from '@/types';

export const profileAPI = {
  updateProfile: (data: ProfileUpdateData) =>
    api.patch<User>('/auth/users/me/', data),

  getProfile: () =>
    api.get<User>('/auth/users/me/')
};