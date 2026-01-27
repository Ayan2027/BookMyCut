import express from "express";
import { auth } from "../auth/auth.middleware.js";
import { approvedSalonOnly } from "../salons/salon.middleware.js";
import { getMyWallet } from "./wallet.controller.js";

const router = express.Router();

router.get("/me", auth, approvedSalonOnly, getMyWallet);

export default router;
