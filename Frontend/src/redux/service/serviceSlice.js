import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMyServices,
  createService,
  deleteService
} from "./serviceThunks";

const initialState = {
  list: [],
  loading: false,
  error: null
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyServices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.list = state.list.filter(s => s._id !== action.payload);
      });
  }
});

export default serviceSlice.reducer;
