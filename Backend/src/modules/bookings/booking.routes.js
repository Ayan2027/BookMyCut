import express from "express";
import { auth } from "../auth/auth.middleware.js";
import { approvedSalonOnly } from "../salons/salon.middleware.js";
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getSalonBookings,
} from "./booking.controller.js";

const router = express.Router();

// Users
router.post("/", auth, createBooking);
router.get("/me", auth, getMyBookings);

// --- SALON OWNER ROUTES ---
// This matches: GET /api/bookings/salons/me
router.get("/salons/me", auth, approvedSalonOnly, getSalonBookings);

// Salons
router.put("/salons/:bookingId/status", auth, approvedSalonOnly, updateBookingStatus);

export default router;
