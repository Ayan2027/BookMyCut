import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  name: String,
  phone: String,
  avatar: String
});

export default mongoose.model("UserProfile", userProfileSchema);
