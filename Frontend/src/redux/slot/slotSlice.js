import { createSlice } from "@reduxjs/toolkit";
import { fetchMySlots, generateSlots, deleteSlot } from "./slotThunks";

const initialState = {
  list: [],
  loading: false,
};

const slotSlice = createSlice({
  name: "slot",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySlots.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(generateSlots.fulfilled, (state) => {
        // no direct update
      })
      .addCase(deleteSlot.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.payload);
      });
  },
});

export default slotSlice.reducer;
