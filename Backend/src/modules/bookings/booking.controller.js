import Booking from "./booking.model.js";
import Slot from "../slots/slot.model.js";
import Service from "../services/service.model.js";
import Salon from "../salons/salon.model.js";
import { sendMail } from "../../services/mail.service.js";

import Payment from "../payments/payment.model.js";
import { razorpay } from "../../config/razorpay.js";

export const getSalonBookings = async (req, res) => {
  try {
    const salon = await Salon.findOne({ owner: req.user._id });
    if (!salon) {
      return res.status(404).json({ message: "Salon profile not found" });
    }

    const bookings = await Booking.find({ salon: salon._id })
      .populate("user", "name phone email")
      .populate("services")
      .populate("slot") // 🔥 ADD THIS
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch registry" });
  }
};

/* User creates booking */
export const createBooking = async (req, res) => {
  console.log("BODY:", req.body);
  const { salonId, slotId, services, bookingType, address } = req.body;

  // Ensure slot is available
  const slot = await Slot.findOne({
    _id: slotId,
    salon: salonId,
    status: "AVAILABLE",
  });
  console.log("FOUND SLOT:", slot);
  if (!slot) return res.status(400).json({ message: "Slot not available" });

  // Load services
  const serviceDocs = await Service.find({
    _id: { $in: services },
    salon: salonId,
  });

  const subtotal = serviceDocs.reduce((sum, s) => sum + s.price, 0);
  const platformFee = Math.round(subtotal * 0.04); // 4% commission
  const totalAmount = subtotal + platformFee;

  const booking = await Booking.create({
    user: req.user._id,
    salon: salonId,
    slot: slotId,
    services,
    subtotal,
    platformFee,
    totalAmount,
    bookingType,
    address,
    status: "PENDING",
  });
  console.log("booking ", booking);
  res.json(booking);
};

/* User gets own bookings */
export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("salon slot services")
    .sort({ createdAt: -1 }); // newest first

  res.json(bookings);
};

/* Salon updates booking status */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("slot salon");
    if (!booking) return res.status(404).json({ message: "Booking_Not_Found" });

    if (String(booking.salon.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized_Access" });
    }

    // --- FINANCIAL SETTLEMENT LOGIC ---
    // We only process funds if transitioning to COMPLETED for the first time
    if (status === "COMPLETED" && booking.status !== "COMPLETED") {
      const netPayout = booking.subtotal;

      await Salon.findByIdAndUpdate(booking.salon._id, {
        $inc: {
          balance: netPayout,
          lifetimeEarnings: netPayout,
          totalBookings: 1,
        },
      });

      booking.completedAt = new Date();
      console.log(
        `SETTLEMENT_LOG: ₹${netPayout} transferred to Salon balance.`,
      );
    }

    // --- SLOT MANAGEMENT ---
    if (status === "CANCELLED") {
      await Slot.findByIdAndUpdate(booking.slot._id, { status: "AVAILABLE" });
    } else {
      await Slot.findByIdAndUpdate(booking.slot._id, { status: "BOOKED" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Protocol_Update_Failed" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    console.log(" ===== CANCEL BOOKING START =====");

    const { bookingId } = req.params;
    const { cancelledBy } = req.body;

    console.log("📌 Booking ID:", bookingId);
    console.log("📌 Cancelled By:", cancelledBy);

    const booking = await Booking.findById(bookingId).populate([
      "services",
      "user",
      "slot",
      {
        path: "salon",
        populate: { path: "owner", select: "email" },
      },
    ]);

    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ Booking found:", booking._id);
    console.log("📌 Booking status:", booking.status);

    if (booking.status === "COMPLETED") {
      console.log("❌ Cannot cancel completed booking");
      return res
        .status(400)
        .json({ message: "Cannot cancel completed booking" });
    }

    const payment = await Payment.findOne({ booking: booking._id });

    if (!payment) {
      console.log("❌ Payment not found");
      return res.status(404).json({ message: "Payment not found" });
    }

    console.log("💰 Payment found");
    console.log("📌 Razorpay Payment ID:", payment.razorpayPaymentId);
    console.log("📌 Payment status:", payment.status);
    console.log("📌 Payment amount:", payment.amount);

    if (payment.status === "REFUNDED") {
      console.log("⚠️ Already refunded");
      return res.json({ message: "Already refunded" });
    }

    // ⏱️ TIME CALCULATION
    const slotTime = new Date(`${booking.slot.date}T${booking.slot.startTime}`);
    const now = new Date();

    console.log("⏱️ Slot Time:", slotTime);
    console.log("⏱️ Current Time:", now);

    if (now > slotTime && cancelledBy === "USER") {
      console.log("❌ User trying to cancel after slot time");
      return res.status(400).json({ message: "Cannot cancel after slot time" });
    }

    const diffHours = (slotTime - now) / (1000 * 60 * 60);
    console.log("⏱️ Hours before slot:", diffHours);

    let refundPercentage = 0;

    if (cancelledBy === "SALON") {
      refundPercentage = 1;
    } else {
      if (diffHours > 6) refundPercentage = 0.8;
      else if (diffHours > 2) refundPercentage = 0.6;
      else if (diffHours > 0) refundPercentage = 0.4;
      else refundPercentage = 0;
    }

    console.log("💸 Refund %:", refundPercentage * 100);

    const refundAmount = Math.floor(payment.amount * refundPercentage);
    console.log("💸 Refund Amount (₹):", refundAmount);

    let refundResponse = null;

    // 💰 Razorpay refund
    if (refundAmount > 0) {
      console.log("🚀 Initiating Razorpay refund...");

      try {
        if (!payment.razorpayPaymentId) {
          console.log("❌ Missing Razorpay Payment ID");
          return res.status(400).json({ message: "Invalid payment reference" });
        }
        console.log("DB Payment ID:", payment.razorpayPaymentId);

        refundResponse = await razorpay.payments.refund(
          payment.razorpayPaymentId,
          { amount: refundAmount * 100 },
        );

        console.log("✅ Refund Success:", refundResponse);
      } catch (err) {
        console.error("❌ REFUND FAILED FULL:", err?.error || err);

        return res.status(500).json({
          message: err?.error?.description || "Refund failed at gateway",
        });
      }
    } else {
      console.log("⚠️ No refund applicable");
    }

    // 💾 Update DB
    payment.refundAmount = refundAmount;
    payment.refundId = refundResponse?.id || null;
    payment.status =
      refundAmount === payment.amount
        ? "REFUNDED"
        : refundAmount > 0
          ? "PARTIAL_REFUND"
          : payment.status;

    await payment.save();
    console.log("💾 Payment updated");

    booking.status = "CANCELLED";
    booking.cancelledBy = cancelledBy;
    await booking.save();

    console.log("📦 Booking updated");

    await Slot.findByIdAndUpdate(booking.slot._id, {
      status: "AVAILABLE",
    });

    console.log("🪑 Slot released");

    console.log("📩 Sending notifications...");

    // 📩 NOTIFICATIONS (NON-BLOCKING 🚀)
    try {
      const salon = booking.salon;
      const user = booking.user;
      const adminEmail = process.env.ADMIN_EMAIL;
      const serviceNames = booking.services.map((s) => s.name).join(", ");

      const emailStyle = `style="font-family: sans-serif; padding: 20px; border: 2px solid #ff4d4d; border-radius: 10px;"`;
      const headerStyle = `style="color: #d32f2f; font-size: 24px; text-transform: uppercase; font-weight: 900;"`;
      const moneyBox = `style="background: #fff5f5; padding: 15px; border-left: 5px solid #d32f2f; margin: 15px 0;"`;

      // 📧 USER EMAIL
      const userHtml = `
    <div ${emailStyle}>
      <h2 ${headerStyle}>Booking Cancelled ❌</h2>
      <p>Hi <b>${user?.name}</b>, your booking at <b>${salon?.name}</b> has been terminated.</p>
      <div ${moneyBox}>
        <p style="margin: 0; color: #d32f2f;"><b>REFUND DETAILS:</b></p>
        <p>Refund Amount: <b>₹${refundAmount}</b> (${refundPercentage * 100}% of total)</p>
        <p style="font-size: 12px; color: #666;">Note: It may take 5-7 business days to reflect in your account.</p>
      </div>
      <p><b>Original Booking ID:</b> ${booking._id}</p>
      <p><b>Service:</b> ${serviceNames}</p>
    </div>
  `;

      // 📧 SALON EMAIL
      const salonHtml = `
    <div ${emailStyle}>
      <h2 ${headerStyle}>Appointment Terminated 🚨</h2>
      <p>The appointment for <b>${user?.name}</b> has been cancelled by <b>${cancelledBy}</b>.</p>
      <div ${moneyBox}>
        <p><b>Slot Released:</b> ${booking.slot?.date} at ${booking.slot?.startTime}</p>
        <p><b>Status:</b> Slot is now Available for others.</p>
      </div>
      <p><b>Services lost:</b> ${serviceNames}</p>
    </div>
  `;

      // ⚡ Send Emails (HTML)
      await Promise.all([
        user?.email &&
          sendMail(
            user.email,
            "Booking Cancelled & Refund Initiated",
            userHtml,
          ),

        salon?.owner?.email &&
          sendMail(salon.owner.email, "⚠️ ALERT: Booking Cancelled", salonHtml),

        adminEmail &&
          sendMail(
            adminEmail,
            `🚨 Cancellation Alert: ${booking._id}`,
            userHtml,
          ),
      ]);

      console.log("✅ Styled Emails sent");
    } catch (mailErr) {
      console.error("❌ Mail Error:", mailErr.message);
    }

    console.log("🔥 ===== CANCEL BOOKING END =====");

    res.json({
      message: "Booking cancelled",
      refundAmount,
      refundPercentage,
    });
  } catch (err) {
    console.error("❌ GLOBAL ERROR:", err);
    res.status(500).json({ message: "Cancellation failed" });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Not found" });

    // 🔒 only delete if not paid
    if (booking.status !== "PENDING") {
      return res.status(400).json({ message: "Cannot delete booking" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};