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
  async ({ serviceId, slotId }) => {
    const res = await api.post("/bookings", {
      serviceId,
      slotId,
    });
    return res.data;
  },
);

export const fetchMyBookings = createAsyncThunk("booking/fetchMy", async () => {
  const res = await api.get("/bookings/me");
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
