import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  verifyOtp,
  hydrateAuth,
  logout
} from "./authThunks";

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
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.hydrated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* Verify OTP */
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.hydrated = true;
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
