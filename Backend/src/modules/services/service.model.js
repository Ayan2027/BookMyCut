import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },
  name: String,
  price: Number,
  durationMinutes: Number,
  isHomeService: Boolean,
  isActive: { type: Boolean, default: true }
});

export default mongoose.model("Service", serviceSchema);
