import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },
  balance: { type: Number, default: 0 }
});

export default mongoose.model("SalonWallet", walletSchema);
