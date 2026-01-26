import mongoose from "mongoose";

/* Temporary OTP storage */
export const signupRequestSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["USER", "SALON"] },
  otp: String,
  expiresAt: { type: Date, index: { expires: 0 } }   // TTL auto delete
});

/* Real account */
const accountSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["USER", "SALON", "ADMIN"] },
  provider: { type: String, default: "email" },
  isVerified: { type: Boolean, default: true },
  status: { type: String, default: "ACTIVE" }
}, { timestamps: true });

export const SignupRequest = mongoose.model("SignupRequest", signupRequestSchema);
export const Account = mongoose.model("Account", accountSchema);
