import { createSlice } from "@reduxjs/toolkit";
import {
  fetchServicesBySalon,
  fetchSlotsBySalon,
  fetchMyBookings,
} from "./bookingThunks";

const initialState = {
  services: [],
  slots: [],
  bookings: [],
  selectedService: null,
  selectedSlot: null,
  selectedDate: null, // NEW
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setService: (state, action) => {
      state.selectedService = action.payload;
    },
    setSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    resetBooking: () => initialState,
    setDate: (state, action) => {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesBySalon.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServicesBySalon.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchSlotsBySalon.fulfilled, (state, action) => {
        state.slots = action.payload;
      })
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      });
  },
});

export const { setService, setSlot, resetBooking,setDate } = bookingSlice.actions;
export default bookingSlice.reducer;
