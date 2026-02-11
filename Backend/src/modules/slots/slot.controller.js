import Slot from "./slot.model.js";

export const generateSlots = async (req, res) => {
  const { date } = req.body;

  const startTime = "09:00";
  const endTime = "20:00";
  const intervalMinutes = 30;

  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const toTime = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  let cur = toMinutes(startTime);
  const end = toMinutes(endTime);

  const slots = [];

  while (cur + intervalMinutes <= end) {
    slots.push({
      salon: req.salon._id,
      date,
      startTime: toTime(cur),
      endTime: toTime(cur + intervalMinutes)
    });

    cur += intervalMinutes;
  }

  try {
    const created = await Slot.insertMany(slots, { ordered: false });
    res.json({
      message: "Slots generated",
      created: created.length
    });
  } catch {
    res.json({
      message: "Slots already exist for this date"
    });
  }
};
