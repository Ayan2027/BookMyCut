// src/redux/admin/adminThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../../services/admin.service";

/* Fetch small overview: pending salons, total salons, bookings count, payments count */
export const fetchAdminOverview = createAsyncThunk(
  "admin/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      // parallel calls
      const [pendingRes, salonsRes, bookingsRes, paymentsRes] = await Promise.all([
        adminService.getPendingSalons(1, 5), // fetch first 5 pending for preview
        adminService.getAllSalons(),
        adminService.getBookings(),
        adminService.getPayments(),
      ]);

      return {
        pendingList: pendingRes.data || [],
        pendingCount: pendingRes.data?.length ?? 0,
        salonsCount: Array.isArray(salonsRes.data) ? salonsRes.data.length : 0,
        bookingsCount: Array.isArray(bookingsRes.data) ? bookingsRes.data.length : 0,
        paymentsCount: Array.isArray(paymentsRes.data) ? paymentsRes.data.length : 0,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

/* Approve/Reject/Suspend actions (return updated salon or id) */
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
