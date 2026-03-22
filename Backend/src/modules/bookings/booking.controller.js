import Booking from "./booking.model.js";
import Slot from "../slots/slot.model.js";
import Service from "../services/service.model.js";
import Salon from "../salons/salon.model.js";

/* Salon gets its own bookings */
export const getSalonBookings = async (req, res) => {
  try {
    console.log("in getsalonbookings")
    // 1. Find the salon owned by the logged-in user
    const salon = await Salon.findOne({ owner: req.user._id });
    if (!salon) return res.status(404).json({ message: "Salon profile not found" });
    
    // 2. Find all bookings linked to this salon
    const bookings = await Booking.find({ salon: salon._id })
      .populate("user", "name phone email") // Populate customer details
      .populate("services")
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
  const slot = await Slot.findOne({ _id: slotId, salon: salonId, status: "AVAILABLE" });
  console.log("FOUND SLOT:", slot);
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
  console.log("booking ",booking)
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
          totalBookings: 1 
        }
      });
      
      console.log(`SETTLEMENT_LOG: ₹${netPayout} transferred to Salon balance.`);
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
