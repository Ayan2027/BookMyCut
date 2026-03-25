import crypto from "crypto";
import Booking from "../bookings/booking.model.js";
import Payment from "./payment.model.js";
import { razorpay } from "../../config/razorpay.js";
import Wallet from "../wallets/wallet.model.js";
import Slot from "../slots/slot.model.js";
import Salon from "../salons/salon.model.js";
import { sendWhatsAppMessage } from "../../services/whatsapp.service.js";
import { sendSMS } from "../../services/sms.service.js";
import { sendMail } from "../../services/mail.service.js";

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


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Server config error" });
    }

    // 🔐 Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 🔍 Find payment
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // ⚠️ Prevent duplicate processing
    if (payment.status === "PAID") {
      return res.json({ message: "Already verified" });
    }

    // 💰 Update payment
    payment.status = "PAID";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    // 📅 Get booking with nested populate (IMPORTANT FIX ✅)
    const booking = await Booking.findById(payment.booking).populate([
      "services",
      "user",
      "slot",
      {
        path: "salon",
        populate: {
          path: "owner",
          select: "email",
        },
      },
    ]);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "CONFIRMED";
    await booking.save();

    // 🪑 Block slot safely
    await Slot.findOneAndUpdate(
      { _id: booking.slot, status: { $ne: "BOOKED" } },
      { status: "BOOKED" }
    );

    // 💼 Credit wallet
    const wallet = await Wallet.findOneAndUpdate(
      { salon: payment.salon },
      { $inc: { balance: payment.salonEarning } },
      { upsert: true, new: true }
    );

    // 📩 Notifications
    try {
      const salon = booking.salon;
      const user = booking.user;

      // ✅ FIXED: Get salon email from owner
      const salonEmail = salon?.owner?.email;

      const serviceNames = booking.services
        .map((s) => s.name)
        .join(", ");

      console.log("Salon email:", salonEmail);
      console.log("User email:", user?.email);

      // 📧 SALON EMAIL
      if (salonEmail) {
        const salonHtml = `
          <h2>New Booking Received 💇</h2>
          <p><b>Customer:</b> ${user?.name || "Customer"}</p>
          <p><b>Phone:</b> ${user?.phone || "N/A"}</p>
          <p><b>Service:</b> ${serviceNames}</p>
          <p><b>Date:</b> ${booking.slot?.date}</p>
          <p><b>Time:</b> ${booking.slot?.startTime}</p>
          <p><b>Amount:</b> ₹${booking.totalAmount}</p>
        `;

        await sendMail(salonEmail, "New Booking - BookMyCut", salonHtml);
      }

      // 📧 USER EMAIL
      if (user?.email) {
        const userHtml = `
          <h2>Booking Confirmed ✅</h2>
          <p>Hi ${user?.name || "User"},</p>
          <p>Your appointment is booked.</p>
          <p><b>Salon:</b> ${salon?.name}</p>
          <p><b>Date:</b> ${booking.slot?.date}</p>
          <p><b>Time:</b> ${booking.slot?.startTime}</p>
          <p><b>Amount:</b> ₹${booking.totalAmount}</p>
        `;

        await sendMail(user.email, "Booking Confirmed", userHtml);
      }
    } catch (err) {
      console.error("Notification failed:", err.message);
    }

    return res.json({ message: "Payment verified", wallet });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};