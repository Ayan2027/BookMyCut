import Salon from "../salons/salon.model.js";
import Booking from "../bookings/booking.model.js";
import Payment from "../payments/payment.model.js";
import Wallet from "../wallets/wallet.model.js";

/* Get salon applications */
export const getSalons = async (req, res) => {
  const salons = await Salon.find({ status: req.query.status });
  res.json(salons);
};

/* Approve salon */
export const approveSalon = async (req, res) => {
  const salon = await Salon.findByIdAndUpdate(
    req.params.salonId,
    { status: "APPROVED", approvedAt: new Date() },
    { new: true }
  );
  res.json(salon);
};

/* Reject salon */
export const rejectSalon = async (req, res) => {
  const salon = await Salon.findByIdAndUpdate(
    req.params.salonId,
    { status: "REJECTED" },
    { new: true }
  );
  res.json(salon);
};

/* Suspend salon */
export const suspendSalon = async (req, res) => {
  const salon = await Salon.findByIdAndUpdate(
    req.params.salonId,
    { status: "SUSPENDED" },
    { new: true }
  );
  res.json(salon);
};

/* View bookings */
export const allBookings = async (req, res) => {
  const bookings = await Booking.find().populate("salon user");
  res.json(bookings);
};

/* View payments */
export const allPayments = async (req, res) => {
  const payments = await Payment.find().populate("salon user");
  res.json(payments);
};

/* Payout */
export const payoutSalon = async (req, res) => {
  const wallet = await Wallet.findOne({ salon: req.params.salonId });
  if (!wallet || wallet.balance === 0)
    return res.status(400).json({ message: "No balance" });

  wallet.balance = 0;
  await wallet.save();

  res.json({ message: "Payout successful" });
};
