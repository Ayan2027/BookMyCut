import { createSlice } from "@reduxjs/toolkit";
import { login, verifyOtp, hydrateAuth, logout, requestOtp } from "./authThunks";

const initialState = {
  token: null,
  user: null,
  role: null,
  loading: false,
  hydrated: false,
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
        state.error = null;
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
        state.hydrated = true;
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
        state.hydrated = true;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Hydrate */
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
        state.hydrated = true;
        state.error = null;
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.hydrated = true;
      })

      /* Logout */
      .addCase(logout.fulfilled, () => initialState);
  }
});

export default authSlice.reducer;
