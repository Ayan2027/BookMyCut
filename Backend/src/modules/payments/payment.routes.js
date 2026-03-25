import express from "express";
import { auth } from "../auth/auth.middleware.js";
import { createOrder, verifyPayment, webhookHandler } from "./payment.controller.js";

const router = express.Router();

router.post("/create-order", auth, createOrder);
router.post("/verify", verifyPayment);

router.post("/webhook", express.raw({ type: "*/*" }), webhookHandler);

export default router;
