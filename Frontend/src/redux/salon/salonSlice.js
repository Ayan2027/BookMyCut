import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMySalon,
  applySalon,
  updateSalon,
  fetchSalons
} from "./salonThunks";

const initialState = {
  exists: false,
  status: null,
  salon: null,
  salons: [],
  loading: false,
  error: null
};

const salonSlice = createSlice({
  name: "salon",
  initialState,
  reducers: {
    clearSalon: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySalon.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMySalon.fulfilled, (state, action) => {
        state.loading = false;
        state.exists = action.payload.exists;
        state.status = action.payload.status;
        state.salon = action.payload.salon;
      })
      .addCase(fetchMySalon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(applySalon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applySalon.fulfilled, (state, action) => {
        state.loading = false;
        state.exists = true;
        state.status = "PENDING";
        state.salon = action.payload;
      })
      .addCase(applySalon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Application failed";
      })

      .addCase(updateSalon.fulfilled, (state, action) => {
        state.salon = action.payload;
      })
      .addCase(fetchSalons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalons.fulfilled, (state, action) => {
        state.loading = false;
        state.salons = action.payload;
      })
      .addCase(fetchSalons.rejected, (state) => {
        state.loading = false;
      });

  }
});

export const { clearSalon } = salonSlice.actions;
export default salonSlice.reducer;
