import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/auth.service";
import { storage } from "../../utils/storage";

/* Request OTP */
export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (data) => {
    await authService.requestOtp(data);
    return data.email;
  }
);

/* Verify OTP */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data) => {
    const res = await authService.verifyOtp(data);
    storage.setToken(res.data.token);
    return res.data;
  }
);

/* Login */
export const login = createAsyncThunk(
  "auth/login",
  async (data) => {
    const res = await authService.login(data);
    storage.setToken(res.data.token);
    return res.data;
  }
);

/* Hydrate user */
export const hydrateAuth = createAsyncThunk(
  "auth/hydrate",
  async () => {
    const res = await authService.me();
    return res.data;
  }
);

/* Logout */
export const logout = createAsyncThunk("auth/logout", async () => {
  storage.clearToken();
});
