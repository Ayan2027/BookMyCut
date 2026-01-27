import nodemailer from "nodemailer";
import { env } from "../config/env.js";

/**
 * Sends email using Gmail SMTP
 * Make sure you use Gmail App Password, not normal password
 */
export const sendMail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"BookMyCut" <${env.MAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log(`OTP mail sent to ${to}`);
  } catch (err) {
    console.error("Mail error:", err);
    throw new Error("Failed to send email");
  }
};
