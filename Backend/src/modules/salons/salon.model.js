import mongoose from "mongoose";

const salonSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },

  name: { type: String, required: true },
  description: String,
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },

  image: String,

  mapLink: String,   // NEW FIELD

  location: {
    lat: Number,
    lng: Number
  },

  documents: [String],

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
    default: "PENDING"
  },

  rating: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },

  appliedAt: { type: Date, default: Date.now },
  approvedAt: Date
});

export default mongoose.model("Salon", salonSchema);
