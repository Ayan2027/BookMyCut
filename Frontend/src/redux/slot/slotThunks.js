import { createAsyncThunk } from "@reduxjs/toolkit";
import { slotService } from "../../services/slot.service";

export const fetchMySlots = createAsyncThunk(
  "slot/fetchMy",
  async () => {
    const res = await slotService.getMy();
    return res.data;
  }
);

export const generateSlots = createAsyncThunk(
  "slot/generate",
  async (data) => {
    const res = await slotService.generate(data);
    return res.data;
  }
);

export const deleteSlot = createAsyncThunk(
  "slot/delete",
  async (id) => {
    await slotService.remove(id);
    return id;
  }
);
