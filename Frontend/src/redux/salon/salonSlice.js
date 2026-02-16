import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMySalon,
  applySalon,
  updateSalon,
  fetchSalons,
  fetchSalonById // Ensure this is imported from your thunks
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
      /* 1. FETCH MY SALON (Owner Side) */
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

      /* 2. FETCH SALON BY ID (Public/Customer Side) */
      .addCase(fetchSalonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalonById.fulfilled, (state, action) => {
        state.loading = false;
        state.salon = action.payload; // Public route returns the salon object directly
        state.exists = !!action.payload;
        state.status = action.payload?.status || null;
      })
      .addCase(fetchSalonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* 3. APPLY FOR SALON */
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

      /* 4. UPDATE SALON */
      .addCase(updateSalon.fulfilled, (state, action) => {
        state.salon = action.payload;
      })

      /* 5. FETCH ALL SALONS */
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