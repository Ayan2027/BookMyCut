import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  name: String,
  phone: String,
  avatar: String,
  faceShape: String,
  hairstyleRecommendation: [
    { name: String, description: String }
  ],
  hairstyleRecommendedAt: Date
});

export default mongoose.model("UserProfile", userProfileSchema);