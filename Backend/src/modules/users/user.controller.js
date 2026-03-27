import UserProfile from "./user.model.js"

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    let profile = await UserProfile.findOne({
      account: req.user._id
    });

    if (!profile) {
      profile = await UserProfile.create({
        account: req.user._id,
        name,
        phone,
        avatar
      });
    } else {
      profile.name = name;
      profile.phone = phone;
      profile.avatar = avatar;
      await profile.save();
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      account: req.user._id
    });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // 💰 Total spent (only PAID)
    const payments = await Payment.aggregate([
      {
        $match: {
          user: userId,
          status: { $in: ["PAID", "PARTIAL_REFUND", "REFUNDED"] },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
          totalRefund: { $sum: "$refundAmount" },
        },
      },
    ]);

    const summary = payments[0] || {
      totalSpent: 0,
      totalRefund: 0,
    };

    // 📚 Booking history (you already have, but we enrich it)
    const bookings = await Booking.find({ user: userId })
      .populate("salon services slot")
      .sort({ createdAt: -1 });

    // 🔁 Attach refund info
    const paymentsMap = await Payment.find({ user: userId });

    const enrichedBookings = bookings.map((b) => {
      const pay = paymentsMap.find(
        (p) => String(p.booking) === String(b._id)
      );

      return {
        ...b.toObject(),
        paymentStatus: pay?.status || "N/A",
        refundAmount: pay?.refundAmount || 0,
      };
    });

    res.json({
      totalSpent: summary.totalSpent,
      totalRefund: summary.totalRefund,
      netSpent: summary.totalSpent - summary.totalRefund,
      bookings: enrichedBookings,
    });

  } catch (err) {
    res.status(500).json({ message: "User dashboard failed" });
  }
};
