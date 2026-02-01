import { createAsyncThunk } from "@reduxjs/toolkit";
import { serviceService } from "../../services/service.service";

export const fetchMyServices = createAsyncThunk(
  "service/fetchMy",
  async () => {
    const res = await serviceService.getMy();
    return res.data;
  }
);

export const createService = createAsyncThunk(
  "service/create",
  async (data) => {
    const res = await serviceService.create(data);
    return res.data;
  }
);

export const deleteService = createAsyncThunk(
  "service/delete",
  async (id) => {
    await serviceService.remove(id);
    return id;
  }
);
