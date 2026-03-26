import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema({
  salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },

  date: { type: Date, required: true }, // settlement date

  amount: Number, // total payable
  paidAmount: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["PENDING", "PARTIAL", "PAID"],
    default: "PENDING",
  },

  note: String,

  processedAt: Date
}, { timestamps: true });

export default mongoose.model("Payout", payoutSchema);