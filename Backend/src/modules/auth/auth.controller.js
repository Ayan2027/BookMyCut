import bcrypt from "bcrypt";
import { SignupRequest, Account } from "./auth.model.js";
import { generateOTP, otpExpiry } from "../../services/otp.service.js";
import { signToken } from "../../services/jwt.service.js";
import { sendMail } from "../../services/mail.service.js";

//* Step 1 – Request OTP */
export const requestOTP = async (req, res) => {
  const { email, password, role } = req.body;

  // 1. Email Validation Protocol
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  // 2. Restricted Password Validation (Backend Sync)
  // Ensures 6-10 characters, at least one letter, and at least one digit
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,10}$/;
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Security Error: Password must be 6-10 characters with both letters and digits",
    });
  }

  // 3. Existence Check
  const account = await Account.findOne({ email });
  if (account) {
    return res.status(400).json({ message: "An account with this ID already exists" });
  }

  // 4. Secure Hash Generation
  const hash = await bcrypt.hash(password, 10);
  const otp = generateOTP();

  // 5. Update or Create Signup Request
  await SignupRequest.findOneAndUpdate(
    { email },
    { email, passwordHash: hash, role, otp, expiresAt: otpExpiry() },
    { upsert: true }
  );

  // 6. Transmission via Mail
  const mailSent = await sendMail(
    email,
    "BookMyCut OTP Verification",
    `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <div style="text-align: center;">
          <h1 style="margin: 0; color: #6C63FF;">✂️ BookMyCut</h1>
          <p style="color: #888; font-size: 14px;">Salon Booking Made Easy</p>
        </div>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />

        <h2 style="text-align: center; color: #333;">Your OTP Code</h2>
        
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #000;">
            ${otp}
          </span>
        </div>

        <p style="text-align: center; color: #555;">
          This OTP is valid for <strong>5 minutes</strong>.
        </p>

        <p style="margin-top: 30px; font-size: 13px; color: #999; text-align: center;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>

      <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
        © ${new Date().getFullYear()} BookMyCut. All rights reserved.
      </p>
    </div>
    `
  );

  if (!mailSent) {
    return res.status(500).json({
      message: "Unable to transmit OTP. Please verify your email node.",
    });
  }

  res.json({ message: "OTP signal sent successfully" });
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
    isVerified: true,
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
  res.json({
    token,
    role: account.role,
    user: account
  });

};

/* Current user */
export const me = (req, res) => {
  res.json(req.user);
};
