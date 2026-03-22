import { createAsyncThunk } from "@reduxjs/toolkit";
import { salonService } from "../../services/salon.service";
import api from "../../services/api";

export const fetchMySalon = createAsyncThunk(
  "salon/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await salonService.getMySalon();
      console.log("res of fetchMySalon:", res);
      return res.data;
    } catch (err) {
      console.error("fetchMySalon error:", err.response?.data);

      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch salon" }
      );
    }
  }
);


export const applySalon = createAsyncThunk(
  "salon/apply",
  async (data, { rejectWithValue }) => {
    try {
      const res = await salonService.apply(data);

      console.log("Salon apply response:", res);

      return res.data;
    } catch (err) {
      console.log("Salon apply error:", err);

      return rejectWithValue(
        err.response?.data?.message || "Salon apply failed"
      );
    }
  }
);


export const updateSalon = createAsyncThunk(
  "salon/update",
  async (data) => {
    const res = await salonService.update(data);
    return res.data;
  }
);

export const fetchSalons = createAsyncThunk(
  "salon/fetchAll",
  async () => {
    const res = await salonService.getAll();
    return res.data;
  }
);

export const fetchSalonById = createAsyncThunk(
  "salon/fetchById",
  async (salonId) => {
    const res = await salonService.getById(salonId);
    return res.data;
  }
);



export const fetchSalonBookings = createAsyncThunk(
  "salon/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("bookings/salons/me");
      
      // CRITICAL: Return res.data so the slice gets the array []
      // Your console.log showed the array is inside res.data
      console.log("salonbooks data extracted:", res.data); 
      
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch bookings");
    }
  }
);
export const updateSalonBookingStatus = createAsyncThunk(
  "salon/updateBookingStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      // Cleaned URL to match your backend: router.put("/salons/:bookingId/status", ...)
      const res = await api.put(`/bookings/salons/${id}/status`, { status });
      
      // We return the updated booking so the Redux slice can update the UI instantly
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || "Protocol_Override: Failed");
    }
  }
);