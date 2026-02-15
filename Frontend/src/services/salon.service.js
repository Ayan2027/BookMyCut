import api from "./api";

export const salonService = {
  getMySalon: () => api.get("/salons/me"),
  apply: (data) => api.post("/salons/apply", data),
  update: (data) => api.put("/salons/me", data),
  getAll: () => api.get("/salons"),

};
