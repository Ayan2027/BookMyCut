import express from "express";
import { auth } from "../auth/auth.middleware.js";
import {
  applySalon,
  getMySalon,
  updateMySalon,
  getApprovedSalons
} from "./salon.controller.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getApprovedSalons);

/* OWNER */
router.post("/apply", auth, applySalon);
router.get("/me", auth, getMySalon);
router.put("/me", auth, updateMySalon);

export default router;
