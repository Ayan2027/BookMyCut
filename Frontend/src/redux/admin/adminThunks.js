// src/redux/admin/adminThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../../services/admin.service";
import api from "../../services/api";

/* ================= OVERVIEW ================= */
export const fetchAdminOverview = createAsyncThunk(
  "admin/overview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/overview");
      console.log("adminoverview ",res.data)
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

/* ================= SALON ACTIONS ================= */
export const approveSalon = createAsyncThunk(
  "admin/approveSalon",
  async (salonId, { rejectWithValue }) => {
    try {
      const res = await adminService.approveSalon(salonId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const rejectSalon = createAsyncThunk(
  "admin/rejectSalon",
  async ({ salonId, reason }, { rejectWithValue }) => {
    try {
      const res = await adminService.rejectSalon(salonId, { reason });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const suspendSalon = createAsyncThunk(
  "admin/suspendSalon",
  async (salonId, { rejectWithValue }) => {
    try {
      const res = await adminService.suspendSalon(salonId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

/* ================= BOOKINGS ================= */
export const fetchAllBookings = createAsyncThunk(
  "admin/fetchAllBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminService.getBookings();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load bookings"
      );
    }
  }
);

export const adminUpdateBookingStatus = createAsyncThunk(
  "admin/updateBookingStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/admin/bookings/${id}`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

/* ================= PAYOUTS ================= */
export const fetchPayouts = createAsyncThunk(
  "admin/fetchPayouts",
  async (date, { rejectWithValue }) => {
    try {
      const res = await adminService.getPayoutsByDate(date);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const payoutAction = createAsyncThunk(
  "admin/payoutAction",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await adminService.markPayout(payload);

      // ✅ refresh payouts after action
      dispatch(fetchPayouts(payload.date));

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);