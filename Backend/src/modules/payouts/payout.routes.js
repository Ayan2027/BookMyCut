import express from "express";
import { markPayout,getPayoutsByDate } from "./payout.controller.js";

const router = express.Router();

router.get("/", getPayoutsByDate);
router.post("/mark", markPayout);

export default router;