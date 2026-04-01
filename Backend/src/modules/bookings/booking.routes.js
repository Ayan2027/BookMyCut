import express from "express";
import { auth } from "../auth/auth.middleware.js";
import { approvedSalonOnly } from "../salons/salon.middleware.js";
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getSalonBookings,
  cancelBooking, // 1. Import the controller function
  deleteBooking
} from "./booking.controller.js";

const router = express.Router();

// --- USER ROUTES ---
router.post("/", auth, createBooking);
router.get("/me", auth, getMyBookings);

/**
 * @route   PATCH /api/bookings/:bookingId/cancel
 * @desc    Cancel a booking (User or Salon) with refund calculation
 * @access  Private
 */
router.patch("/:bookingId/cancel", auth, cancelBooking); 
router.delete("/:bookingId", auth, deleteBooking);

// --- SALON OWNER ROUTES ---
router.get("/salons/me", auth, approvedSalonOnly, getSalonBookings);

// Salons can update status (ACCEPTED/COMPLETED)
router.put("/salons/:bookingId/status", auth, approvedSalonOnly, updateBookingStatus);

export default router;