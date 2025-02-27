// frontend/src/api/services/auth.ts
import api from '@/api/config/axios';
import { API_ENDPOINTS } from '@/constants/api';
import { LoginCredentials, RegisterData, User } from '@/types';

interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export const authAPI = {
  login: (credentials: LoginCredentials) => 
    api.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials),

  register: (data: RegisterData) => 
    api.post<AuthResponse>(API_ENDPOINTS.auth.register, data),

  resetPassword: (email: string) => 
    api.post(API_ENDPOINTS.auth.resetPassword, { email }),

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.post('/auth/password/change/', {
      old_password: oldPassword,
      new_password: newPassword
    });
    return response.data;
  },

  getCurrentUser: () => 
    api.get<User>(API_ENDPOINTS.auth.profile),
};