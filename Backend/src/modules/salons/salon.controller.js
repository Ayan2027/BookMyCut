import Salon from "./salon.model.js";
import Slot from "../slots/slot.model.js";

/* Salon owner applies */
/* Salon owner applies */
export const applySalon = async (req, res) => {
  try {
    const exists = await Salon.findOne({ owner: req.user._id });
    
    if (exists) {
      return res.status(400).json({
        message: "Salon already exists for this user",
      });
    }
    
    const { name, description, address, city, image, mapLink, phone } = req.body;

    // Required fields
    if (!name || !address || !city || !phone) {
      return res.status(400).json({
        message: "Name, address, city and phone are required",
      });
    }

    // Basic phone validation (must start with + and country code)
    // if (!phone.startsWith("+")) {
    //   return res.status(400).json({
    //     message: "Phone must include country code (e.g. +919876543210)",
    //   });
    // }

    let location = null;

    // Extract coordinates from map link
    if (mapLink) {
      try {
        const url = new URL(mapLink);
        const host = url.hostname;

        if (
          !host.includes("google.com") &&
          !host.includes("goo.gl") &&
          !host.includes("maps.app.goo.gl")
        ) {
          return res.status(400).json({
            message: "Invalid Google Maps link",
          });
        }

        // Case 1: ?q=lat,lng
        const q = url.searchParams.get("q");

        if (q && q.includes(",")) {
          const [lat, lng] = q.split(",").map(Number);

          if (!isNaN(lat) && !isNaN(lng)) {
            location = { lat, lng };
          }
        }

        // Case 2: links like /@25.4358,81.8463
        if (!location && url.pathname.includes("@")) {
          const match = url.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

          if (match) {
            location = {
              lat: parseFloat(match[1]),
              lng: parseFloat(match[2]),
            };
          }
        }
      } catch {
        return res.status(400).json({
          message: "Invalid map link format",
        });
      }
    }

    const salon = await Salon.create({
      owner: req.user._id,
      name,
      description,
      address,
      city,
      image,
      mapLink,
      location,
      phone, // NEW FIELD
    });

    res.json({
      message: "Salon application submitted",
      salon,
    });
  } catch (err) {
    console.error("Apply salon error:", err);
    res.status(500).json({ message: err.message });
  }
};



export const getMySalon = async (req, res) => {
  try {
    const salon = await Salon.findOne({ owner: req.user._id });

    if (!salon) {
      return res.json({ exists: false });
    }

    // --- PRO-TIP: SENSITIVE DATA STRIPPING ---
    // If you ever add internal admin notes or private docs, 
    // you might want to pick specific fields here.
    
    res.json({
      exists: true,
      status: salon.status,
      salon: {
        ...salon._doc,
        // Fallback to 0 if the field doesn't exist in older DB entries
        balance: salon.balance || 0,
        lifetimeEarnings: salon.lifetimeEarnings || 0,
        totalBookings: salon.totalBookings || 0
      },
    });
  } catch (err) {
    console.error("getMySalon error:", err);
    res.status(500).json({ message: "Internal_Server_Error: Terminal_Access_Denied" });
  }
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
    const salons = await Salon.find({ status: "APPROVED" }).select(
      "name city description address rating image mapLink"
    );

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
        message: "Date is required",
      });
    }

    const slots = await Slot.find({
      salon: salonId,
      date,
      status: "AVAILABLE",
    }).sort({ startTime: 1 });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSalonById = async (req, res) => {
  try {
    const { salonId } = req.params;
    const salon = await Salon.findById(salonId);

    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    res.json(salon);
  } catch (error) {
    res.status(500).json({ message: "Error fetching salon details" });
  }
};