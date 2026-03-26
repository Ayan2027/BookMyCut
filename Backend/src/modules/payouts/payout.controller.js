import Booking from "../bookings/booking.model.js";
import Salon from "../salons/salon.model.js";
import Payout from "./payout.model.js";

export const getPayoutsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // 🔥 Get completed bookings of that day
    const earnings = await Booking.aggregate([
      {
        $match: {
          status: "COMPLETED",
          updatedAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$salon",
          totalEarning: { $sum: "$subtotal" },
        },
      },
      {
        $lookup: {
          from: "salons",
          localField: "_id",
          foreignField: "_id",
          as: "salon",
        },
      },
      { $unwind: "$salon" },
    ]);

    // 🔥 Merge with payouts
    const payouts = await Payout.find({
      date: { $gte: start, $lte: end },
    });

    const result = earnings.map((e) => {
      const payout = payouts.find(
        (p) => String(p.salon) === String(e._id)
      );

      return {
        salonId: e._id,
        salonName: e.salon.name,
        earning: e.totalEarning,
        balance: e.salon.balance,

        payoutStatus: payout?.status || "PENDING",
        paidAmount: payout?.paidAmount || 0,
      };
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payouts" });
  }
};

export const markPayout = async (req, res) => {
  try {
    const { salonId, date, amount, note } = req.body;

    const salon = await Salon.findById(salonId);

    if (amount > salon.balance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 🔥 Deduct balance
    salon.balance -= amount;
    await salon.save();

    // 🔥 Upsert payout
    const payout = await Payout.findOneAndUpdate(
      { salon: salonId, date: new Date(date) },
      {
        $inc: { paidAmount: amount },
        $set: { processedAt: new Date(), note },
      },
      { upsert: true, new: true }
    );

    // update status
    if (payout.paidAmount >= payout.amount) {
      payout.status = "PAID";
    } else {
      payout.status = "PARTIAL";
    }

    await payout.save();

    res.json(payout);

  } catch (err) {
    res.status(500).json({ message: "Payout failed" });
  }
};