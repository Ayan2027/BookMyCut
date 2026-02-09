import api from "./api";

export const bookingService = {
  getSalonBookings: () => api.get("/salons/me/bookings"),
  updateStatus: (id, status) =>
    api.put(`/salons/bookings/${id}/status`, { status })
};
