import Review from "./review.model.js";
import Booking from "../bookings/booking.model.js";
import Salon from "../salons/salon.model.js";


// ✅ Create Review (5-star rating)
// review.controller.js
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking || booking.status !== "COMPLETED") {
      return res.status(400).json({ message: "Invalid booking for review" });
    }

    // Check if already reviewed (using the booking field)
    if (booking.rating) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    const review = await Review.create({
      user: req.user.id,
      salon: booking.salon,
      booking: booking._id,
      rating
    });

    // Atomic update for Salon
    const salon = await Salon.findById(booking.salon);
    const newTotal = (salon.totalReviews || 0) + 1;
    const newAvg = ((salon.averageRating || 0) * (salon.totalReviews || 0) + rating) / newTotal;

    await Salon.findByIdAndUpdate(booking.salon, {
      averageRating: newAvg.toFixed(1),
      totalReviews: newTotal
    });

    // ✅ SAVE RATING TO BOOKING so UI knows it is reviewed
    booking.rating = rating;
    await booking.save();

    res.status(201).json({ message: "Review submitted", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ Get reviews of a salon
export const getSalonReviews = async (req, res) => {
  try {
    const { salonId } = req.params;

    const reviews = await Review.find({ salon: salonId })
      .populate("user", "email")
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};