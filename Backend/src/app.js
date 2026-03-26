import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import salonRoutes from "./modules/salons/salon.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import serviceRoutes from "./modules/services/service.routes.js";
import slotRoutes from "./modules/slots/slot.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import walletRoutes from "./modules/wallets/wallet.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import profileRoutes from "./modules/users/user.routes.js"
import reviewRoutes from "./modules/reviews/review.routes.js";
import payoutRoutes from "./modules/payouts/payout.routes.js"
const app = express();

app.use(cors());

// 👇 KEEP this FIRST
app.use("/payments/webhook", express.raw({ type: "*/*" }));

// 👇 THEN normal parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get("/", (req, res) => {
  res.send("BookMyCut API running 🚀");
});

app.use("/auth", authRoutes);
app.use("/salons", salonRoutes);
app.use("/admin", adminRoutes);
app.use("/services", serviceRoutes);
app.use("/slots", slotRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/wallet", walletRoutes);
app.use("/upload", uploadRoutes);
app.use("/profile", profileRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin/payouts",payoutRoutes)


export default app;
