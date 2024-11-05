import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrencyReducerInitialState } from "../../types/reducer-types";
import { Currency } from "../../types/types";

const initialState: CurrencyReducerInitialState = {
  selectedCurrency: 'USD',
  symbol: '$',
  loading: false,
  exchangeRate: 1,
};

export const currencyReducer = createSlice({
  name: "currencyReducer",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.selectedCurrency = action.payload.code;
      state.symbol = action.payload.symbol;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setExchangeRate: (state, action: PayloadAction<number>) => {
      state.exchangeRate = action.payload;
    },
  },
});

export const { setCurrency, setLoading ,setExchangeRate} = currencyReducer.actions;
export default currencyReducer.reducer;
