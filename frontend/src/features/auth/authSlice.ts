import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/axios.ts';
import { ENDPOINTS } from '../../api/endpoints.ts';
import { LoginRequest, RegisterRequest } from '../../types/auth.types.ts';
import { User } from '../../types/index.ts';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { dispatch }) => {
    try {
      const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
      // Сохраняем токены
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      
      // После получения токена сразу запрашиваем данные пользователя
      const userResponse = await api.get(ENDPOINTS.AUTH.ME);
      return {
        tokens: data,
        user: userResponse.data
      };
    } catch (error: any) {
      throw error.response?.data?.detail || 'Login failed';
    }
  }
);


export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const { data } = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(ENDPOINTS.AUTH.ME);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.tokens.access;
        state.refreshToken = action.payload.tokens.refresh;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;