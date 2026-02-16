import { createAsyncThunk } from "@reduxjs/toolkit";
import { salonService } from "../../services/salon.service";

export const fetchMySalon = createAsyncThunk(
  "salon/fetchMy",
  async () => {
    const res = await salonService.getMySalon();
    console.log("res of fetchmysalon ",res)
    return res.data;
  }
);

export const applySalon = createAsyncThunk(
  "salon/apply",
  async (data, { rejectWithValue }) => {
    try {
      const res = await salonService.apply(data);

      console.log("Salon apply response:", res);

      return res.data;
    } catch (err) {
      console.log("Salon apply error:", err);

      return rejectWithValue(
        err.response?.data?.message || "Salon apply failed"
      );
    }
  }
);


export const updateSalon = createAsyncThunk(
  "salon/update",
  async (data) => {
    const res = await salonService.update(data);
    return res.data;
  }
);

export const fetchSalons = createAsyncThunk(
  "salon/fetchAll",
  async () => {
    const res = await salonService.getAll();
    return res.data;
  }
);

export const fetchSalonById = createAsyncThunk(
  "salon/fetchById",
  async (salonId) => {
    const res = await salonService.getById(salonId);
    return res.data;
  }
);