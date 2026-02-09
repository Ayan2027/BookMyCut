import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMySlots,
  generateSlots,
  deleteSlot
} from "../../redux/slot/slotThunks";

export default function Slots() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.slot);

  const [form, setForm] = useState({
    date: "",
    start: "09:00",
    end: "18:00",
    interval: 30
  });

  useEffect(() => {
    dispatch(fetchMySlots());
  }, [dispatch]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.date) return;
    dispatch(generateSlots(form));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Slots</h2>
        <p className="text-gray-500">
          Generate and manage booking slots
        </p>
      </div>

      {/* GENERATOR */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-3">
        <h3 className="font-semibold">Generate Slots</h3>

        <div className="grid grid-cols-4 gap-3">
          <input
            type="date"
            className="border p-2 rounded"
            onChange={(e) => update("date", e.target.value)}
          />

          <input
            type="time"
            className="border p-2 rounded"
            value={form.start}
            onChange={(e) => update("start", e.target.value)}
          />

          <input
            type="time"
            className="border p-2 rounded"
            value={form.end}
            onChange={(e) => update("end", e.target.value)}
          />

          <input
            type="number"
            className="border p-2 rounded"
            value={form.interval}
            onChange={(e) => update("interval", e.target.value)}
          />
        </div>

        <button
          onClick={submit}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Generate Slots
        </button>
      </div>

      {/* SLOT LIST */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Generated Slots</h3>

        {list.length === 0 && (
          <p className="text-gray-500">
            No slots generated yet.
          </p>
        )}

        <div className="grid grid-cols-5 gap-3">
          {list.map((slot) => (
            <SlotCard
              key={slot._id}
              slot={slot}
              onDelete={() => dispatch(deleteSlot(slot._id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SlotCard({ slot, onDelete }) {
  return (
    <div className="border rounded-xl p-3 text-center">
      <p className="font-semibold">{slot.time}</p>

      <button
        onClick={onDelete}
        className="text-red-500 text-xs mt-2"
      >
        Delete
      </button>
    </div>
  );
}
