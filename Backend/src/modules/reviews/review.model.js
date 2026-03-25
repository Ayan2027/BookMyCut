import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },

  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: true
  },

  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true // 🔥 prevents duplicate reviews
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }

}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);