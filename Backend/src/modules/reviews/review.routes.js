import express from "express";
import { createReview, getSalonReviews } from "./review.controller.js";
import { auth,requireRole } from "../auth/auth.middleware.js";
const router = express.Router();

// ⭐ Create review
router.post("/", auth,createReview);

// 📄 Get all reviews for a salon
router.get("/:salonId", getSalonReviews);

export default router;