import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/auth.service";
import { storage } from "../../utils/storage";

/* Request OTP */
export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (data, { rejectWithValue }) => {
    try {
      await authService.requestOtp(data);
      return data.email;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to send OTP",
      );
    }
  },
);

/* Verify OTP */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.verifyOtp(data);

      storage.setToken(res.data.token);
      storage.setRole(res.data.role);

      return {
        token: res.data.token,
        role: res.data.role,
        user: res.data.user,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid OTP");
    }
  },
);

/* Login */
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);

      storage.setToken(res.data.token);
      storage.setRole(res.data.role);

      return {
        token: res.data.token,
        role: res.data.role,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

/* Logout */
export const logout = createAsyncThunk("auth/logout", async () => {
  storage.clearToken();
  storage.clearRole();
  return true;   // important
});

/* Update Profile */
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.updateProfile(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Profile update failed"
      );
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getProfile();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load profile"
      );
    }
  }
);