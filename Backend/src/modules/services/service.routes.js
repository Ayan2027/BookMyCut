import express from "express";
import { auth } from "../auth/auth.middleware.js";
import { approvedSalonOnly } from "../salons/salon.middleware.js";
import {
  createService,
  getMyServices,
  updateService,
  deleteService,
  getServicesBySalon   // add this
} from "./service.controller.js";

const router = express.Router();

/* PUBLIC: get services of a salon */
router.get("/salon/:salonId", getServicesBySalon);

/* OWNER ONLY */
router.use(auth, approvedSalonOnly);

router.post("/", createService);
router.get("/me", getMyServices);
router.put("/:serviceId", updateService);
router.delete("/:serviceId", deleteService);

export default router;
