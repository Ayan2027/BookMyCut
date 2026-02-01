import api from "./api";

export const serviceService = {
  getMy: () => api.get("/services/me"),
  create: (data) => api.post("/services", data),
  remove: (id) => api.delete(`/services/${id}`)
};
