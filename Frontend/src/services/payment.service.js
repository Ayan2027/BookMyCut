import api from "./api";

export const createOrderAPI = (bookingId) =>
  api.post("/payments/create-order", { bookingId });

export const verifyPaymentAPI = (payload) =>
  api.post("/payments/verify", payload);
