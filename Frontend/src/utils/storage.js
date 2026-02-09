export const storage = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token) => localStorage.setItem("token", token),
  clear: () => localStorage.removeItem("token"),
};
