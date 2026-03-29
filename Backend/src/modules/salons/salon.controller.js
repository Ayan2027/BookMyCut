import Salon from "./salon.model.js";
import Slot from "../slots/slot.model.js";
import Booking from "../bookings/booking.model.js";
import Payout from "../payouts/payout.model.js";


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

    const { name, description, address, city, image, mapLink, phone } =
      req.body;

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
        totalBookings: salon.totalBookings || 0,
      },
    });
  } catch (err) {
    console.error("getMySalon error:", err);
    res
      .status(500)
      .json({ message: "Internal_Server_Error: Terminal_Access_Denied" });
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
    // ✅ Added 'averageRating' and 'totalReviews' to the selection
    const salons = await Salon.find({ status: "APPROVED" }).select(
      "name city description address image mapLink averageRating totalReviews",
    );

    // ✅ Optional: Ensure defaults exist before sending to frontend
    const sanitizedSalons = salons.map((salon) => ({
      ...salon._doc,
      averageRating: salon.averageRating || 0,
      totalReviews: salon.totalReviews || 0,
    }));

    res.json(sanitizedSalons);
  } catch (err) {
    res.status(500).json({ message: "Data retrieval failed: " + err.message });
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

    // 👉 Get current time
    const now = new Date();

    // 👉 Convert current date to YYYY-MM-DD
    const today = now.toISOString().split("T")[0];

    let filteredSlots = slots;

    // 👉 Apply filter ONLY if selected date is today
    if (date === today) {
      // add 1 hour buffer
      const currentMinutes = now.getHours() * 60 + now.getMinutes() + 60;

      filteredSlots = slots.filter((slot) => {
        const [hour, minute] = slot.startTime.split(":").map(Number);
        const slotMinutes = hour * 60 + minute;

        return slotMinutes >= currentMinutes;
      });
    }

    res.json(filteredSlots);
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

export const getSalonDailyEarnings = async (req, res) => {
  try {
    const salon = await Salon.findOne({ owner: req.user._id });

    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    const data = await Booking.aggregate([
      {
        $match: {
          salon: salon._id,
          status: "COMPLETED",
          completedAt: { $ne: null }, // ✅ important
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$completedAt" },
            month: { $month: "$completedAt" },
            day: { $dayOfMonth: "$completedAt" },
          },
          earnings: { $sum: "$subtotal" },
          bookings: { $sum: 1 },
        },
      },
      {
        $addFields: {
          date: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
              timezone: "Asia/Kolkata",
            },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Salon earnings failed" });
  }
};


export const getSalonFinanceSummary = async (req, res) => {
  try {
    const salon = await Salon.findOne({ owner: req.user._id });
    if (!salon) return res.status(404).json({ message: "Salon not found" });

    // 1. Aggregation for Earnings using updatedAt
    const earnings = await Booking.aggregate([
      {
        $match: {
          salon: salon._id,
          status: "COMPLETED"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" },
            day: { $dayOfMonth: "$updatedAt" }
          },
          earned: { $sum: "$subtotal" }
        }
      }
    ]);

    // 2. Aggregation for Payouts
    const payouts = await Payout.aggregate([
      { $match: { salon: salon._id, status: "PAID" } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" }
          },
          paid: { $sum: "$paidAmount" }
        }
      }
    ]);

    // 3. Totals
    const totalEarnings = earnings.reduce((acc, curr) => acc + curr.earned, 0);
    const totalPaid = payouts.reduce((acc, curr) => acc + curr.paid, 0);

    // 4. Merge into Daily Array
    const map = {};
    earnings.forEach(e => {
      const key = `${e._id.year}-${e._id.month}-${e._id.day}`;
      map[key] = { earned: e.earned, paid: 0 };
    });

    payouts.forEach(p => {
      const key = `${p._id.year}-${p._id.month}-${p._id.day}`;
      if (!map[key]) map[key] = { earned: 0, paid: 0 };
      map[key].paid = p.paid;
    });

    const daily = Object.entries(map).map(([date, val]) => ({
      date,
      earned: val.earned,
      paid: val.paid,
      remaining: val.earned - val.paid
    })).sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      totalEarnings,
      totalPaid,
      balance: salon.balance || 0,
      daily
    });

  } catch (err) {
    console.error("Finance Error:", err);
    res.status(500).json({ message: "Failed to load finance summary" });
  }
};