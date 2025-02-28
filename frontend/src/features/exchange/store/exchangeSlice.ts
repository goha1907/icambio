import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExchangeState, ExchangeRate } from '@/types';

const initialState: ExchangeState = {
  rates: [],
  loading: false,
  error: null,
};

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    setRates: (state, action: PayloadAction<ExchangeRate[]>) => {
      state.rates = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setRates, setLoading, setError } = exchangeSlice.actions;
export default exchangeSlice.reducer;
