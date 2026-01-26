import Salon from "./salon.model.js";

export const approvedSalonOnly = async (req, res, next) => {
  try {
    if (req.user.role !== "SALON") {
      return res.status(403).json({ message: "Salon access only" });
    }

    const salon = await Salon.findOne({ owner: req.user._id });
    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    if (salon.status !== "APPROVED") {
      return res.status(403).json({
        message: "Salon not approved by admin yet"
      });
    }

    req.salon = salon;
    next();
  } catch (err) {
    res.status(500).json({ message: "Salon check failed" });
  }
};
