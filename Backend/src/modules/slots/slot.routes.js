import express from "express";
import { auth } from "../auth/auth.middleware.js";
import { approvedSalonOnly } from "../salons/salon.middleware.js";
import {
  generateSlots,
} from "./slot.controller.js";

const router = express.Router();

router.use(auth, approvedSalonOnly);

router.post("/generate", generateSlots);
// router.get("/me", getMySlots);
// router.delete("/:slotId", deleteSlot);

export default router;
