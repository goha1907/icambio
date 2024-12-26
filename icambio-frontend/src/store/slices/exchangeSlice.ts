import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExchangeState {
  rates: any[];
  branches: any[];
  selectedBranch: any | null;
}

const initialState: ExchangeState = {
  rates: [],
  branches: [],
  selectedBranch: null
};

export const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    setRates: (state, action: PayloadAction<any[]>) => {
      state.rates = action.payload;
    },
    setBranches: (state, action: PayloadAction<any[]>) => {
      state.branches = action.payload;
    },
    setSelectedBranch: (state, action: PayloadAction<any>) => {
      state.selectedBranch = action.payload;
    }
  }
});

export const { setRates, setBranches, setSelectedBranch } = exchangeSlice.actions;
export default exchangeSlice.reducer;