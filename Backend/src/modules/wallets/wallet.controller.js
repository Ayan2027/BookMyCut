import Wallet from "./wallet.model.js";
import Salon from "../salons/salon.model.js";

export const getMyWallet = async (req, res) => {
  const salon = await Salon.findOne({ owner: req.user._id });
  if (!salon) return res.status(404).json({ message: "Salon not found" });

  const wallet = await Wallet.findOne({ salon: salon._id });
  res.json(wallet || { balance: 0 });
};
