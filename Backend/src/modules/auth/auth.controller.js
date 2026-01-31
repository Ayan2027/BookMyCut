import bcrypt from "bcrypt";
import { SignupRequest, Account } from "./auth.model.js";
import { generateOTP, otpExpiry } from "../../services/otp.service.js";
import { signToken } from "../../services/jwt.service.js";
import { sendMail } from "../../services/mail.service.js";

/* Step 1 – Request OTP */
export const requestOTP = async (req, res) => {
  const { email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);
  const otp = generateOTP();

  await SignupRequest.findOneAndUpdate(
    { email },
    { email, passwordHash: hash, role, otp, expiresAt: otpExpiry() },
    { upsert: true }
  );

  await sendMail(email, "BookMyCut OTP", `Your OTP is ${otp}`);
  res.json({ message: "OTP sent" });
};
    
/* Step 2 – Verify OTP */
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const reqRow = await SignupRequest.findOne({ email });
  
  if (!reqRow || reqRow.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });
  
  const account = await Account.create({
    email,
    passwordHash: reqRow.passwordHash,
    role: reqRow.role,
    isVerified: true
  });

  await SignupRequest.deleteOne({ email });

  const token = signToken(account);
  res.json({ token, role: account.role });
};

/* Login */
export const login = async (req, res) => {
  const { email, password } = req.body;
  const account = await Account.findOne({ email });
  if (!account) return res.status(400).json({ message: "Not found" });

  const ok = await bcrypt.compare(password, account.passwordHash);
  if (!ok) return res.status(400).json({ message: "Wrong password" });

  const token = signToken(account);
  res.json({ token, role: account.role });
};

/* Current user */
export const me = (req, res) => {
  res.json(req.user);
};
