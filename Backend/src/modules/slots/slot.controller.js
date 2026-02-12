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

  // Current date and time
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

  // 1. Block past dates
  if (date < todayStr) {
    return res.status(400).json({
      message: "Cannot generate slots for past dates"
    });
  }

  let cur = toMinutes(startTime);
  const end = toMinutes(endTime);

  // 2. If generating for today, skip past time
  if (date === todayStr) {
    const currentMinutes =
      now.getHours() * 60 + now.getMinutes();

    if (currentMinutes > cur) {
      // round up to next interval
      cur =
        Math.ceil(currentMinutes / intervalMinutes) *
        intervalMinutes;
    }
  }

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

  if (slots.length === 0) {
    return res.status(400).json({
      message: "No valid slots left for this date"
    });
  }

  try {
    const created = await Slot.insertMany(slots, {
      ordered: false
    });

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


/* GET my slots */
export const getMySlots = async (req, res) => {
  try {
    const slots = await Slot.find({ salon: req.salon._id })
      .sort({ date: 1, startTime: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE slot */
export const deleteSlot = async (req, res) => {
  try {
    const result = await Slot.findOneAndDelete({
      _id: req.params.slotId,
      salon: req.salon._id
    });

    if (!result) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ message: "Slot deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
