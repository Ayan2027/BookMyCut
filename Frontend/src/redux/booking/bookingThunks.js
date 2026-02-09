import { createAsyncThunk } from "@reduxjs/toolkit";
import { bookingService } from "../../services/booking.service";

export const fetchSalonBookings = createAsyncThunk(
  "booking/fetchSalon",
  async () => {
    const res = await bookingService.getSalonBookings();
    return res.data;
  }
);

export const updateBookingStatus = createAsyncThunk(
  "booking/updateStatus",
  async ({ id, status }) => {
    const res = await bookingService.updateStatus(id, status);
    return res.data;
  }
);
