import express from "express";
import { auth } from "../auth/auth.middleware.js";
import {
  applySalon,
  getMySalon,
  updateMySalon,
  getApprovedSalons,
  getSlotsBySalon ,
  getSalonById
} from "./salon.controller.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getApprovedSalons);
router.get("/:salonId", getSalonById);

// NEW: get slots of a salon (for customers)
router.get("/:salonId/slots", getSlotsBySalon);

/* OWNER */
router.post("/apply", auth, applySalon);
router.get("/me", auth, getMySalon);
router.put("/me", auth, updateMySalon);

export default router;
