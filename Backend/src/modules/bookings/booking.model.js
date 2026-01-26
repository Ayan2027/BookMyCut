import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],

  subtotal: Number,
  platformFee: Number,
  totalAmount: Number,

  bookingType: { type: String, enum: ["IN_SALON", "HOME_SERVICE"] },
  address: String,

  status: { type: String, default: "PENDING" }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
