import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import exchangeReducer from '@/features/exchange/store/exchangeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exchange: exchangeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
