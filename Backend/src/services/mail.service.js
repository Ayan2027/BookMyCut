import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

export const sendMail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "BookMyCut <onboarding@resend.dev>", // default sender
      to,
      subject,
      html,
    });

    console.log(`OTP mail sent to ${to}`);
    return true;
  } catch (err) {
    console.error("Mail error:", err);
    return false;
  }
};