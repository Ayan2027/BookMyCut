import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true },
  status: {
    type: String,
    enum: ["AVAILABLE", "BOOKED", "BLOCKED"],
    default: "AVAILABLE"
  }
}, { timestamps: true });

slotSchema.index({ salon: 1, date: 1, startTime: 1 }, { unique: true });

export default mongoose.model("Slot", slotSchema);
