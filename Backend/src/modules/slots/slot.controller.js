import Slot from "./slot.model.js";

/* Generate slots */
export const generateSlots = async (req, res) => {
  const { date, startTime, endTime, intervalMinutes } = req.body;

  const slots = [];
  let current = startTime;

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
    res.json({ created: created.length });
  } catch (err) {
    res.json({ message: "Some slots already existed" });
  }
};

/* Get my slots */
export const getMySlots = async (req, res) => {
  const slots = await Slot.find({ salon: req.salon._id });
  res.json(slots);
};

/* Delete slot */
export const deleteSlot = async (req, res) => {
  const result = await Slot.findOneAndDelete({
    _id: req.params.slotId,
    salon: req.salon._id
  });

  if (!result) {
    return res.status(404).json({ message: "Slot not found" });
  }

  res.json({ message: "Slot deleted" });
};
