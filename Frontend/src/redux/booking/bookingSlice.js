import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSalonBookings,
  updateBookingStatus
} from "./bookingThunks";

const initialState = {
  list: [],
  loading: false
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalonBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalonBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      });
  }
});

export default bookingSlice.reducer;
