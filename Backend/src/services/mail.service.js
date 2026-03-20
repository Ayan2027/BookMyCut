import axios from "axios";
import { env } from "../config/env.js";

export const sendMail = async (to, subject, html) => {
  try {
    if (!env.BREVO_API_KEY) throw new Error("BREVO_API_KEY is missing");
    if (!env.SENDER_EMAIL) throw new Error("SENDER_EMAIL is missing from env");

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        // Use the env variable here
        sender: { name: "BookMyCut", email: env.SENDER_EMAIL },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": env.BREVO_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      }
    );

    console.log("Mail sent successfully. Message ID:", response.data.messageId);
    return true;
  } catch (err) {
    console.error("Mail error details:", err.response ? err.response.data : err.message);
    return false;
  }
};