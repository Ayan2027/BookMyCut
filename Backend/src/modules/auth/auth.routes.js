import express from "express";
import { requestOTP, verifyOTP, login, me } from "./auth.controller.js";
import { auth } from "./auth.middleware.js";

const router = express.Router();

router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/me", auth, me);

export default router;
