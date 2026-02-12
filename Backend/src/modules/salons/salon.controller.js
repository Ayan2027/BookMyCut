import Salon from "./salon.model.js";

/* Salon owner applies */
export const applySalon = async (req, res) => {
  try {
    console.log("req ",req.user._id)
    const exists = await Salon.findOne({ owner: req.user._id });
    if (exists) {
      return res.status(400).json({ message: "Already applied" });
    }
    console.log("req ",req.user._id)

    const salon = await Salon.create({
      owner: req.user._id,
      ...req.body,
    });

    res.json({ message: "Salon application submitted", salon });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMySalon = async (req, res) => {
  console.log(req.user._id)
  const salon = await Salon.findOne({ owner: req.user._id });

  if (!salon) {
    return res.json({ exists: false });
  }

  res.json({
    exists: true,
    status: salon.status,
    salon,
  });
};

/* Update salon */
export const updateMySalon = async (req, res) => {
  const salon = await Salon.findOneAndUpdate(
    { owner: req.user._id },
    req.body,
    { new: true },
  );

  res.json(salon);
};
