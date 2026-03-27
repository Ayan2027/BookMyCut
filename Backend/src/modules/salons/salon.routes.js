import express from "express";
import { auth } from "../auth/auth.middleware.js";
import {
  applySalon,
  getMySalon,
  updateMySalon,
  getApprovedSalons,
  getSlotsBySalon,
  getSalonById,
  getSalonDailyEarnings,
  getSalonFinanceSummary
} from "./salon.controller.js";

const router = express.Router();

/* 1. OWNER ROUTES */
router.post("/apply", auth, applySalon);
router.get("/me", auth, getMySalon);
router.put("/me", auth, updateMySalon);

/* 2. SPECIFIC/STATIC ROUTES (Must come before :salonId) */
router.get("/", getApprovedSalons);
router.get("/daily-earnings", auth, getSalonDailyEarnings); // Added auth if needed
router.get("/finance", auth, getSalonFinanceSummary);      // ✅ NOW REACHABLE

/* 3. DYNAMIC ROUTES (Catch-alls come last) */
router.get("/:salonId/slots", getSlotsBySalon);
router.get("/:salonId", getSalonById); 

export default router;