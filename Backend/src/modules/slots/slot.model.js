import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },
  date: String,
  startTime: String,
  endTime: String,
  status: { type: String, enum: ["AVAILABLE", "BOOKED", "BLOCKED"], default: "AVAILABLE" }
});

slotSchema.index({ salon: 1, date: 1, startTime: 1 }, { unique: true });

export default mongoose.model("Slot", slotSchema);
