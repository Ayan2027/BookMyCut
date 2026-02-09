import { createAsyncThunk } from "@reduxjs/toolkit";
import { walletService } from "../../services/wallet.service";

export const fetchWallet = createAsyncThunk(
  "wallet/fetch",
  async () => {
    const res = await walletService.getMyWallet();
    return res.data;
  }
);
