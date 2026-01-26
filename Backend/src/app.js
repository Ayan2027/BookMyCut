import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import salonRoutes from "./modules/salons/salon.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TrimBhai API running 🚀");
});

app.use("/auth", authRoutes);
app.use("/salons", salonRoutes);
app.use("/admin", adminRoutes);

export default app;
