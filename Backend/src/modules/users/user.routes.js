import express from "express";
import { getProfile, updateProfile,getUserDashboard } from "./user.controller.js"; 
import { auth } from "../auth/auth.middleware.js";

const router = express.Router();


router.put("/", auth, updateProfile);
router.get("/", auth, getProfile);
router.get("/dashboard", auth , getUserDashboard);

export default router;
