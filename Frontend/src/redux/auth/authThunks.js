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
      console.log("Full error:", err);
      console.log("Backend message:", err?.response?.data);

      return rejectWithValue(
        err?.response?.data?.message ||
        "Failed to send OTP"
      );
    }
  }
);


/* Verify OTP */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.verifyOtp(data);

      // Backend returns: { token, role }
      storage.setToken(res.data.token);

      return {
        token: res.data.token,
        role: res.data.role,
        user: res.data.user
      };

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid OTP"
      );
    }
  }
);

/* Login */
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);
      console.log("res ", res)
      // Backend returns: { token, role }
      storage.setToken(res.data.token);

      return {
        token: res.data.token,
        role: res.data.role
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* Hydrate user */
export const hydrateAuth = createAsyncThunk(
  "auth/hydrate",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.me();

      // Backend returns full user object
      return res.data;
    } catch (err) {
      return rejectWithValue("Session expired");
    }
  }
);

/* Logout */
export const logout = createAsyncThunk("auth/logout", async () => {
  storage.clearToken();
});
