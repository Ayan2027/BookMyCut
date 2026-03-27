import express from "express";
import { auth, requireRole } from "../auth/auth.middleware.js";
import {
  getSalons,
  approveSalon,
  rejectSalon,
  suspendSalon,
  getAllBookings,
  allPayments,
  payoutSalon,
  adminUpdateBookingStatus,
  getAdminOverview,
  getAdminDailyEarnings
} from "./admin.controller.js";

const router = express.Router();

router.use(auth, requireRole("ADMIN"));

router.get("/salons", getSalons);
router.post("/salons/:salonId/approve", approveSalon);
router.post("/salons/:salonId/reject", rejectSalon);
router.post("/salons/:salonId/suspend", suspendSalon);

router.get("/bookings", getAllBookings);
router.get("/payments", allPayments);
router.post("/payout/:salonId", payoutSalon);

// Update booking status
router.put("/bookings/:id", adminUpdateBookingStatus);

router.get("/overview", getAdminOverview);
router.get("/daily-earnings", getAdminDailyEarnings);


export default router;
