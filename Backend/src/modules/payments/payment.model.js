import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },

  razorpayOrderId: String,
  razorpayPaymentId: String,

  amount: Number,
  platformFee: Number,
  salonEarning: Number,

  status: String
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
