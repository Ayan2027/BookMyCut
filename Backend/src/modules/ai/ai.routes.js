import express from "express";
import { analyzeFace } from "./ai.controller.js";

const router = express.Router();

router.post("/analyze", analyzeFace);

export default router;