import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/lib/api/services/auth';
import { saveAuthData, clearAuthData, getAuthData } from '../services/authService';
import { AuthState, LoginCredentials, RegisterData } from '@/types';

const initialState: AuthState = {
  user: getAuthData().user,
  token: getAuthData().token,
  isAuthenticated: !!getAuthData().token,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await authAPI.login(credentials);
    saveAuthData(response.token, response.user);
    return response;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData) => {
    const response = await authAPI.register({
      ...data,
      re_password: data.password,
    });
    saveAuthData(response.token, response.user);
    return response;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authAPI.logout();
    clearAuthData();
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const response = await authAPI.getCurrentUser();
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка выхода';
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка получения данных пользователя';
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
