import Razorpay from "razorpay";
import { env } from "./env.js";

console.log("Key:", process.env.RAZORPAY_KEY_ID);
console.log("Secret:", process.env.RAZORPAY_KEY_SECRET);

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET
});
