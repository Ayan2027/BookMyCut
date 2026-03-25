import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchServicesBySalon = createAsyncThunk(
  "booking/fetchServices",
  async (salonId) => {
    const res = await api.get(`/services/salon/${salonId}`);
    return res.data;
  },
);

export const fetchSlotsBySalon = createAsyncThunk(
  "booking/fetchSlots",
  async ({ salonId, date }) => {
    const res = await api.get(`/salons/${salonId}/slots?date=${date}`);
    return res.data;
  },
);

export const createBooking = createAsyncThunk(
  "booking/create",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("THUNK RUNNING", payload);
      const res = await api.post("/bookings", payload);
      return res.data;
    } catch (err) {
      console.log("BOOKING API ERROR:", err.response?.data);
      return rejectWithValue(err.response?.data);
    }
  }
);


export const fetchMyBookings = createAsyncThunk("booking/fetchMy", async () => {
  const res = await api.get("/bookings/me");
  console.log("userbookings ",res.data)
  return res.data;
});
export const fetchAllBookings = createAsyncThunk("booking/fetchMy", async () => {
  const res = await api.get("admin/bookings/");
  console.log("userbookings ",res.data)
  return res.data;
});

// NEW: update booking status
export const updateBookingStatus = createAsyncThunk(
  "booking/updateStatus",
  async ({ id, status }) => {
    const res = await api.patch(`/bookings/${id}`, { status });
    return res.data;
  },
);
