import api from "./api";

export const walletService = {
  getMyWallet: () => api.get("/wallet/me")
};
