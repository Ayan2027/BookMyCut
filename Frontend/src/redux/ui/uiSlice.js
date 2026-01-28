import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  toast: null
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLoader(state) {
      state.loading = true;
    },
    hideLoader(state) {
      state.loading = false;
    },
    showToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    }
  }
});

export const { showLoader, hideLoader, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
