import express from "express";
import { auth } from "../auth/auth.middleware.js";
import { createOrder, verifyPayment } from "./payment.controller.js";

const router = express.Router();

router.post("/create-order", auth, createOrder);
router.post("/verify", verifyPayment);

export default router;
