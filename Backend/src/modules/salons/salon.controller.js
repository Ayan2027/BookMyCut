import Salon from "./salon.model.js";

/* Salon owner applies */
export const applySalon = async (req, res) => {
  try {
    const exists = await Salon.findOne({ owner: req.user._id });
    if (exists) {
      return res.status(400).json({ message: "Already applied" });
    }

    const salon = await Salon.create({
      ownerAccountId: req.user._id,
      ...req.body
    });


    res.json({ message: "Salon application submitted", salon });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* Get own salon */
export const getMySalon = async (req, res) => {
  const salon = await Salon.findOne({ owner: req.user._id });
  res.json(salon);
};

/* Update salon */
export const updateMySalon = async (req, res) => {
  const salon = await Salon.findOneAndUpdate(
    { owner: req.user._id },
    req.body,
    { new: true }
  );

  res.json(salon);
};
