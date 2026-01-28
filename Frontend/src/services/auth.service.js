import api from "./api";

export const authService = {
  requestOtp: (data) => api.post("/auth/request-otp", data),
  verifyOtp: (data) => api.post("/auth/verify-otp", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me")
};
