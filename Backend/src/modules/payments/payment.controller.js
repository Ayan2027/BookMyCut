import crypto from "crypto";
import Booking from "../bookings/booking.model.js";
import Payment from "./payment.model.js";
import { razorpay } from "../../config/razorpay.js";
import Wallet from "../wallets/wallet.model.js";
import Slot from "../slots/slot.model.js";
import Salon from "../salons/salon.model.js";
import { sendWhatsAppMessage } from "../../services/whatsapp.service.js";
import { sendSMS } from "../../services/sms.service.js";

/* Create Razorpay order */
export const createOrder = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking || booking.status !== "PENDING")
    return res.status(400).json({ message: "Invalid booking" });

  const order = await razorpay.orders.create({
    amount: booking.totalAmount * 100,
    currency: "INR",
    receipt: booking._id.toString(),
  });

  const payment = await Payment.create({
    booking: booking._id,
    user: booking.user,
    salon: booking.salon,
    razorpayOrderId: order.id,
    amount: booking.totalAmount,
    platformFee: booking.platformFee,
    salonEarning: booking.subtotal,
    status: "CREATED",
  });

  res.json({ order, paymentId: payment._id });
};

/* Verify Razorpay payment */
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

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
  const booking = await Booking.findById(payment.booking).populate(
    "services user slot salon"
  );

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

  // Send WhatsApp messages
  try {
    const salon = booking.salon;
    const user = booking.user;

    const serviceNames = booking.services.map((s) => s.name).join(", ");

    // 💇 SALON MESSAGE
    const salonMessage = `✂️ *New Booking Received*

👤 Customer: ${user?.name || "Customer"}
📞 Phone: ${user?.phone || "N/A"}

💇 Service: ${serviceNames}

📅 Date: ${booking.slot?.date}
⏰ Time: ${booking.slot?.startTime}

💰 Amount: ₹${booking.totalAmount}

🆔 Booking ID: ${booking._id}

✅ Please be ready for the customer.`;

    // 👤 CUSTOMER MESSAGE
    const userMessage = `✅ *Booking Confirmed!*

Hi ${user?.name || "Customer"} 👋

Your appointment is successfully booked 💇

📅 ${booking.slot?.date}
⏰ ${booking.slot?.startTime}

💰 ₹${booking.totalAmount}

📍 Salon: ${salon?.name}

Thank you for choosing us ❤️`;

    // ⚡ Send messages
    if (salon?.phone) {
      await sendWhatsAppMessage(salon.phone, salonMessage);
    }

    // if (user?.phone) {
    //   await sendWhatsAppMessage(user.phone, userMessage);
    // }

  } catch (err) {
    console.error("WhatsApp send failed:", err.message);
  }

  res.json({ message: "Payment verified", wallet });
};