import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import uiReducer from "./ui/uiSlice";
import serviceReducer from "./service/serviceSlice";
import slotReducer from "./slot/slotSlice";
import salonReducer from "./salon/salonSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    salon: salonReducer,
    service: serviceReducer,
    slot: slotReducer,
    ui: uiReducer,
  },
});
