import express from "express";
import { auth } from "../auth/auth.middleware.js";
import { applySalon, getMySalon, updateMySalon } from "./salon.controller.js";

const router = express.Router();

router.post("/apply", auth, applySalon);
router.get("/me", auth, getMySalon);
router.put("/me", auth, updateMySalon);

export default router;
