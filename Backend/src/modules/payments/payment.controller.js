import crypto from "crypto";
import Booking from "../bookings/booking.model.js";
import Payment from "./payment.model.js";
import { razorpay } from "../../config/razorpay.js";
import Wallet from "../wallets/wallet.model.js";
import Slot from "../slots/slot.model.js";

/* Create Razorpay order */
export const createOrder = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking || booking.status !== "PENDING")
    return res.status(400).json({ message: "Invalid booking" });

  const order = await razorpay.orders.create({
    amount: booking.totalAmount * 100,
    currency: "INR",
    receipt: booking._id.toString()
  });

  const payment = await Payment.create({
    booking: booking._id,
    user: booking.user,
    salon: booking.salon,
    razorpayOrderId: order.id,
    amount: booking.totalAmount,
    platformFee: booking.platformFee,
    salonEarning: booking.subtotal,
    status: "CREATED"
  });

  res.json({ order, paymentId: payment._id });
};

/* Verify Razorpay payment */
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature)
    return res.status(400).json({ message: "Invalid signature" });

  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  payment.status = "PAID";
  payment.razorpayPaymentId = razorpay_payment_id;
  await payment.save();

  // Confirm booking
  const booking = await Booking.findById(payment.booking);
  booking.status = "CONFIRMED";
  await booking.save();

  // Block slot
  await Slot.findByIdAndUpdate(booking.slot, { status: "BOOKED" });

  // Credit wallet
  const wallet = await Wallet.findOneAndUpdate(
    { salon: payment.salon },
    { $inc: { balance: payment.salonEarning } },
    { upsert: true, new: true }
  );

  res.json({ message: "Payment verified", wallet });
};
