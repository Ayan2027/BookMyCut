import Booking from "./booking.model.js";
import Slot from "../slots/slot.model.js";
import Service from "../services/service.model.js";

/* User creates booking */
export const createBooking = async (req, res) => {
  const { salonId, slotId, services, bookingType, address } = req.body;

  // Ensure slot is available
  const slot = await Slot.findOne({ _id: slotId, salon: salonId, status: "AVAILABLE" });
  if (!slot) return res.status(400).json({ message: "Slot not available" });

  // Load services
  const serviceDocs = await Service.find({ _id: { $in: services }, salon: salonId });

  const subtotal = serviceDocs.reduce((sum, s) => sum + s.price, 0);
  const platformFee = Math.round(subtotal * 0.1); // 10% commission
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
    status: "PENDING"
  });

  res.json(booking);
};

/* User gets own bookings */
export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("salon slot services");

  res.json(bookings);
};

/* Salon updates booking status */
export const updateBookingStatus = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate("slot salon");

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (String(booking.salon.owner) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not your booking" });
  }

  booking.status = req.body.status;
  await booking.save();

  res.json(booking);
};
