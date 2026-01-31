import { createSlice } from "@reduxjs/toolkit";
import { login, verifyOtp, hydrateAuth, logout } from "./authThunks";

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
      })

      /* Logout */
      .addCase(logout.fulfilled, () => initialState);
  }
});

export default authSlice.reducer;
