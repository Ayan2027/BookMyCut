import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    console.log("MONGO_URI:", env.MONGO_URI);

    await mongoose.connect(env.MONGO_URI);

    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err);
    process.exit(1);
  }
};