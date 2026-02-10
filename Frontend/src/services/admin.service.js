// src/services/admin.service.js
import api from "./api";

export const adminService = {
  getPendingSalons: (page = 1, limit = 10) =>
    api.get(`/admin/salons?status=PENDING&page=${page}&limit=${limit}`),
  getAllSalons: () => api.get("/admin/salons"),
  getBookings: () => api.get("/admin/bookings"),
  getPayments: () => api.get("/admin/payments"),

  approveSalon: (salonId) => api.post(`/admin/salons/${salonId}/approve`),
  rejectSalon: (salonId, data = {}) =>
    api.post(`/admin/salons/${salonId}/reject`, data),
  suspendSalon: (salonId) => api.post(`/admin/salons/${salonId}/suspend`),
};
