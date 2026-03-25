import mongoose from "mongoose";

const salonSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  name: { type: String, required: true },
  description: String,
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  image: String,
  mapLink: String,

  // --- FINANCIAL REGISTRY ---
  balance: { type: Number, default: 0 }, // Current money they can withdraw
  lifetimeEarnings: { type: Number, default: 0 }, // Total ever earned (for badges/stats)

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
    default: "PENDING",
  },

  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },

  appliedAt: { type: Date, default: Date.now },
  approvedAt: Date,
});

export default mongoose.model("Salon", salonSchema);
