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

/* OWNER (must come before dynamic routes) */
router.post("/apply", auth, applySalon);
router.get("/me", auth, getMySalon);
router.put("/me", auth, updateMySalon);

/* PUBLIC */
router.get("/", getApprovedSalons);
router.get("/:salonId/slots", getSlotsBySalon);
router.get("/:salonId", getSalonById);

export default router;
