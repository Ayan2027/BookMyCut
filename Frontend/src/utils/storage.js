export const storage = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token) => localStorage.setItem("token", token),
  clearToken: () => localStorage.removeItem("token"),

  getRole: () => localStorage.getItem("role"),
  setRole: (role) => localStorage.setItem("role", role),
  clearRole: () => localStorage.removeItem("role")
};
