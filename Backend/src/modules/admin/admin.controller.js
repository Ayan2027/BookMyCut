import Salon from "../salons/salon.model.js";
import Booking from "../bookings/booking.model.js";
import Payment from "../payments/payment.model.js";
import Wallet from "../wallets/wallet.model.js";
import Payout from "../payouts/payout.model.js";

/* Get salons (all or filtered by status) */
export const getSalons = async (req, res) => {
  try {
    const filter = {};

    // If status query is provided, filter by it
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const salons = await Salon.find(filter);
    res.json(salons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Approve salon */
export const approveSalon = async (req, res) => {
  try {
    const salon = await Salon.findByIdAndUpdate(
      req.params.salonId,
      { status: "APPROVED", approvedAt: new Date() },
      { new: true },
    );
    res.json(salon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Reject salon */
export const rejectSalon = async (req, res) => {
  try {
    const salon = await Salon.findByIdAndUpdate(
      req.params.salonId,
      { status: "REJECTED" },
      { new: true },
    );
    res.json(salon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Suspend salon */
export const suspendSalon = async (req, res) => {
  try {
    const salon = await Salon.findByIdAndUpdate(
      req.params.salonId,
      { status: "SUSPENDED" },
      { new: true },
    );
    res.json(salon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Admin gets all bookings with Transaction Trace */
/* src/controllers/admin.controller.js */

export const getAllBookings = async (req, res) => {
  try {
    // 1. Fetch bookings and EXCLUDE passwordHash (Security Fix)
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email phone role status") // DO NOT include passwordHash here
      .populate("salon", "name")
      .populate("slot", "date startTime")
      .populate("services", "name price");

    // 2. Fetch payment details for these specific bookings
    const bookingIds = bookings.map((b) => b._id);
    const payments = await Payment.find({ booking: { $in: bookingIds } });

    // 3. Merge the data manually (since Booking doesn't have a paymentId field)
    const results = bookings.map((b) => {
      // Find the payment object that belongs to this booking ID
      const payment = payments.find(
        (p) => p.booking.toString() === b._id.toString(),
      );

      return {
        ...b._doc,
        transaction: payment || null, // This adds the 'transaction' object you need
      };
    });

    res.json(results);
  } catch (err) {
    console.error("ADMIN_FETCH_ERROR:", err);
    res
      .status(500)
      .json({ message: "System failure during registry compilation." });
  }
};

/* View payments */
export const allPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("salon user");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Payout */
export const payoutSalon = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ salon: req.params.salonId });

    if (!wallet || wallet.balance === 0) {
      return res.status(400).json({ message: "No balance" });
    }

    wallet.balance = 0;
    await wallet.save();

    res.json({ message: "Payout successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Admin updates booking status */
export const adminUpdateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAdminOverview = async (req, res) => {
  try {
    // --- BASIC COUNTS ---
    const pendingSalons = await Salon.find({ status: "PENDING" });
    const pendingCount = pendingSalons.length;

    const salonsCount = await Salon.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    const paymentsCount = await Payment.countDocuments();

    // 💰 Total collected + platform revenue
    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalRevenue: { $sum: "$platformFee" },
        },
      },
    ]);

    // 🏦 Pending payouts (REAL money you owe)
    const walletStats = await Salon.aggregate([
      {
        $group: {
          _id: null,
          pendingPayouts: { $sum: "$balance" },
        },
      },
    ]);

    // 💸 Money already paid to salons
    const payoutStats = await Payout.aggregate([
      {
        $group: {
          _id: null,
          paidToSalons: { $sum: "$paidAmount" },
        },
      },
    ]);

    // 💰 Total earned by salons
    const earningsStats = await Salon.aggregate([
      {
        $group: {
          _id: null,
          earnedBySalons: { $sum: "$lifetimeEarnings" },
        },
      },
    ]);

    // --- FINAL FINANCE OBJECT ---
    const finance = {
      totalAmount: paymentStats[0]?.totalAmount || 0,
      totalRevenue: paymentStats[0]?.totalRevenue || 0,

      earnedBySalons: earningsStats[0]?.earnedBySalons || 0,

      pendingPayouts: walletStats[0]?.pendingPayouts || 0,
      paidToSalons: payoutStats[0]?.paidToSalons || 0,
    };

    // --- OPTIONAL SAFETY CHECK (recommended) ---
    if (
      finance.earnedBySalons !==
      finance.pendingPayouts + finance.paidToSalons
    ) {
      console.warn("⚠ Finance mismatch detected");
    }

    res.json({
      pendingList: pendingSalons,
      pendingCount,
      salonsCount,
      bookingsCount,
      paymentsCount,
      finance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin overview failed" });
  }
};

export const getAdminDailyEarnings = async (req, res) => {
  try {
    const data = await Payment.aggregate([
      {
        $match: {
          status: { $in: ["PAID", "PARTIAL_REFUND"] }, // ✅ include partial refunds
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },

          // 💰 Your revenue
          revenue: { $sum: "$platformFee" },

          // 💳 Total collected
          totalCollected: { $sum: "$amount" },

          // 🔁 Refund tracking (important)
          totalRefund: { $sum: "$refundAmount" },
        },
      },
      {
        $addFields: {
          date: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
              timezone: "Asia/Kolkata",
            },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Daily earnings failed" });
  }
};
