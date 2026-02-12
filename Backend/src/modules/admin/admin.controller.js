import Salon from "../salons/salon.model.js";
import Booking from "../bookings/booking.model.js";
import Payment from "../payments/payment.model.js";
import Wallet from "../wallets/wallet.model.js";

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
      { new: true }
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
      { new: true }
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
      { new: true }
    );
    res.json(salon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* View bookings */
export const allBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("salon user");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
