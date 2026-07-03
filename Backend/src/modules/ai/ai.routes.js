import express from "express";
import { auth } from "../auth/auth.middleware.js";
import { analyzeFace, getLatest } from "./ai.controller.js";

const router = express.Router();

router.post("/analyze", auth, analyzeFace);
router.get("/latest", auth, getLatest);

export default router;