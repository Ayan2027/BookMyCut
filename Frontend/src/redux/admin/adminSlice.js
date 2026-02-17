// src/redux/admin/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminOverview,
  approveSalon,
  rejectSalon,
  suspendSalon,
  fetchAllBookings,
  adminUpdateBookingStatus,
} from "./adminThunks";

const initialState = {
  pendingList: [],
  pendingCount: 0,
  salonsCount: 0,
  bookingsCount: 0,
  paymentsCount: 0,
  loading: false,
  error: null,
  bookings: [],
  bookingLoading: false,
  bookingError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOverview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingList = action.payload.pendingList || [];
        state.pendingCount = action.payload.pendingCount ?? 0;
        state.salonsCount = action.payload.salonsCount ?? 0;
        state.bookingsCount = action.payload.bookingsCount ?? 0;
        state.paymentsCount = action.payload.paymentsCount ?? 0;
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message;
      })

      /* Approve / reject / suspend: remove from pendingList if successful */
      .addCase(approveSalon.fulfilled, (state, action) => {
        const id = action.payload?.salon?._id || action.payload?._id;
        state.pendingList = state.pendingList.filter((s) => s._id !== id);
        state.pendingCount = Math.max(0, state.pendingCount - 1);
      })
      .addCase(rejectSalon.fulfilled, (state, action) => {
        const id = action.payload?.salon?._id || action.payload?._id;
        state.pendingList = state.pendingList.filter((s) => s._id !== id);
        state.pendingCount = Math.max(0, state.pendingCount - 1);
      })
      .addCase(suspendSalon.fulfilled, (state, action) => {
        const id = action.payload?.salon?._id || action.payload?._id;
        state.pendingList = state.pendingList.filter((s) => s._id !== id);
        state.pendingCount = Math.max(0, state.pendingCount - 1);
      })
      // Fetch All Bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.bookingLoading = true;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      })

      // Update Status (Optimistic Update or Refresh)
      .addCase(adminUpdateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (b) => b._id === action.payload._id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
