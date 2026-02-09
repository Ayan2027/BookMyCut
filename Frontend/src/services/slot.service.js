import api from "./api";

export const slotService = {
  getMy: () => api.get("/slots/me"),
  generate: (data) => api.post("/slots/generate", data),
  remove: (id) => api.delete(`/slots/${id}`)
};

