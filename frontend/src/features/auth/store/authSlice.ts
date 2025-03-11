import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/lib/api/services/auth';
import { setAuthToken } from '@/lib/api/client';
import { saveAuthData, clearAuthData, getToken, getUser } from '@/features/auth/services/authService';
import type { AuthState, LoginCredentials, RegisterData, User } from '@/types';

interface AuthResponse {
  token: string;
  user: User;
}

const handleLoginError = (error: any) => {
  if (!error.response) {
    return 'Ошибка соединения с сервером. Проверьте интернет-подключение.';
  }
  
  const status = error.response.status;
  
  switch (status) {
    case 400:
      // Проверим наличие специфичных полей
      if (error.response.data.email) {
        return `Ошибка email: ${error.response.data.email[0]}`;
      }
      if (error.response.data.password) {
        return `Ошибка пароля: ${error.response.data.password[0]}`;
      }
      return 'Неверные данные для входа';
    case 401:
      return 'Неверный email или пароль';
    case 403:
      return 'Доступ запрещен. У вас нет прав для выполнения этого действия';
    case 429:
      return 'Слишком много попыток входа. Пожалуйста, попробуйте позже';
    default:
      return 'Произошла ошибка при входе. Пожалуйста, попробуйте позже';
  }
};

// Получение текущего пользователя
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const response = await authAPI.getCurrentUser();
    return response.data;
  },
  {
    // Не выполнять запрос, если нет токена
    condition: () => !!getToken(),
  }
);

// Логин
export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Получаем токен
      const response = await authAPI.login(credentials);
      const token = response.data.access;
      
      // Устанавливаем токен
      setAuthToken(token);
      
      // Получаем данные пользователя
      const userResponse = await authAPI.getCurrentUser();
      const user = userResponse.data;
      
      // Сохраняем данные
      saveAuthData(token, user);
      
      return {
        token,
        user
      };
    } catch (error: any) {
      clearAuthData();
      return rejectWithValue(handleLoginError(error));
    }
  }
);

// Регистрация
export const register = createAsyncThunk<AuthResponse, RegisterData>(
  'auth/register',
  async (data) => {
    try {
      // Регистрируем пользователя
      await authAPI.register(data);

      // Выполняем вход для получения токена
      const loginResponse = await authAPI.login({
        email: data.email,
        password: data.password,
      });
      const token = loginResponse.data.access;

      // Устанавливаем токен
      setAuthToken(token);

      // Получаем данные пользователя
      const userResponse = await authAPI.getCurrentUser();
      const user = userResponse.data;

      // Сохраняем данные
      saveAuthData(token, user);

      return {
        token,
        user,
      };
    } catch (error) {
      clearAuthData();
      throw error;
    }
  }
);

// Инициализация состояния из localStorage
const token = getToken();
const user = getUser();
if (token) {
  setAuthToken(token);
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user,
    token: token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthData();
      setAuthToken(null);
    },
    clearError: (state) => {
      state.error = null;
    }
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
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : handleLoginError(action.payload);
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка';
      })
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        // Сохраняем обновленные данные пользователя
        saveAuthData(state.token as string, action.payload);
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
