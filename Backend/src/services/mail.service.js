import nodemailer from "nodemailer";
import { env } from "../config/env.js";

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
    return true;
  } catch (err) {
    console.error("Mail error:", err);
    return false;   // important
  }
};
