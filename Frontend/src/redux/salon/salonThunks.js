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
  async (data) => {
    const res = await salonService.apply(data);
    console.log("res of applysalon ",res)
    return res.data.salon || res.data;
  }
);

export const updateSalon = createAsyncThunk(
  "salon/update",
  async (data) => {
    const res = await salonService.update(data);
    return res.data;
  }
);
