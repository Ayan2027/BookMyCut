import { createSlice } from "@reduxjs/toolkit";
import { login, verifyOtp, logout, requestOtp } from "./authThunks";
import { storage } from "../../utils/storage";

const initialState = {
  token: storage.getToken() || null,
  user: null,
  role: storage.getRole() || null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* Request OTP */
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Login */
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Verify OTP */
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.user = action.payload.user || null;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Logout */
      .addCase(logout.fulfilled, () => ({
        token: null,
        user: null,
        role: null,
        loading: false,
        error: null
      }));
  }
});

export default authSlice.reducer;
