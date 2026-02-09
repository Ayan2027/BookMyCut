import { createSlice } from "@reduxjs/toolkit";
import { fetchWallet } from "./walletThunks";

const initialState = {
  balance: 0,
  totalEarnings: 0,
  commissionPaid: 0,
  loading: false
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.totalEarnings = action.payload.totalEarnings;
        state.commissionPaid = action.payload.commissionPaid;
      });
  }
});

export default walletSlice.reducer;
