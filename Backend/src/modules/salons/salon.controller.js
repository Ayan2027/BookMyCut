import Salon from "./salon.model.js";
import Slot from "../slots/slot.model.js";

/* Salon owner applies */
export const applySalon = async (req, res) => {
  try {
    console.log("req ", req.user._id);
    const exists = await Salon.findOne({ owner: req.user._id });
    if (exists) {
      console.log("existys");
      return res.status(400).json({ message: "Already applied" });
    }
    console.log("req ", req.user._id);

    const salon = await Salon.create({
      owner: req.user._id,
      ...req.body,
    });
    console.log("salon ", salon);
    res.json({ message: "Salon application submitted", salon });
  } catch (err) {
    console.error("Apply salon error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMySalon = async (req, res) => {
  console.log(req.user._id);
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


export const getApprovedSalons = async (req, res) => {
  try {
    const salons = await Salon.find({ status: "APPROVED" })
      .select("name city address rating location");
      console.log("salons ",salons)
    res.json(salons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Get slots of a salon (for customers) */
export const getSlotsBySalon = async (req, res) => {
  try {
    const { salonId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required"
      });
    }

    const slots = await Slot.find({
      salon: salonId,
      date,
      status: "AVAILABLE"
    }).sort({ startTime: 1 });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
