import Booking from "./booking.model.js";
import Slot from "../slots/slot.model.js";
import Service from "../services/service.model.js";
import Salon from "../salons/salon.model.js";

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

    console.log("in getsalon bookings ", bookings);

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
  const platformFee = Math.round(subtotal * 0.05); // 10% commission
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
    const { bookingId } = req.params;
    const { cancelledBy } = req.body; // USER or SALON

    const booking = await Booking.findById(bookingId).populate("slot");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "COMPLETED") {
      return res.status(400).json({ message: "Cannot cancel completed booking" });
    }

    const payment = await Payment.findOne({ booking: booking._id });

    if (payment.status === "REFUNDED") {
      return res.json({ message: "Already refunded" });
    }

    // ⏱️ TIME CALCULATION
    const slotTime = new Date(`${booking.slot.date}T${booking.slot.startTime}`);
    const now = new Date();

    const diffHours = (slotTime - now) / (1000 * 60 * 60);

    let refundPercentage = 0;

    // 💥 Salon cancel = full refund
    if (cancelledBy === "SALON") {
      refundPercentage = 1;
    } else {
      if (diffHours > 6) refundPercentage = 1;
      else if (diffHours > 2) refundPercentage = 0.8;
      else if (diffHours > 0) refundPercentage = 0.5;
      else refundPercentage = 0;
    }

    const refundAmount = Math.floor(payment.amount * refundPercentage);

    let refundResponse = null;

    // 💰 Razorpay refund
    if (refundAmount > 0) {
      try {
        refundResponse = await razorpay.payments.refund(
          payment.razorpayPaymentId,
          {
            amount: refundAmount * 100,
          }
        );
      } catch (err) {
        console.error("Refund failed:", err);
        return res.status(500).json({ message: "Refund failed at gateway" });
      }
    }

    // 💾 Update DB
    payment.refundAmount = refundAmount;
    payment.refundId = refundResponse?.id || null;

    if (refundAmount === payment.amount) {
      payment.status = "REFUNDED";
    } else if (refundAmount > 0) {
      payment.status = "PARTIAL_REFUND";
    }

    await payment.save();

    booking.status = "CANCELLED";
    booking.cancelledBy = cancelledBy;
    await booking.save();

    // 🔓 Free slot
    await Slot.findByIdAndUpdate(booking.slot._id, {
      status: "AVAILABLE",
    });

    res.json({
      message: "Booking cancelled",
      refundAmount,
      refundPercentage,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cancellation failed" });
  }
};
