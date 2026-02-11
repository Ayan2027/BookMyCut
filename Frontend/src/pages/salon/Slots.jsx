import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMySlots,
  generateSlots,
  deleteSlot
} from "../../redux/slot/slotThunks";

export default function Slots() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.slot);

  const [date, setDate] = useState("");

  useEffect(() => {
    dispatch(fetchMySlots());
  }, [dispatch]);

  const submit = () => {
    if (!date) return;

    dispatch(generateSlots({ date }))
      .then(() => dispatch(fetchMySlots()));
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

        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Generate 9AM–8PM Slots
        </button>
      </div>

      {/* SLOT LIST */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Generated Slots</h3>

        {loading && <p>Loading...</p>}

        {!loading && list.length === 0 && (
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
      <p className="font-semibold">
        {slot.startTime} — {slot.endTime}
      </p>

      <p className="text-xs text-gray-500">
        {slot.date}
      </p>

      <button
        onClick={onDelete}
        className="text-red-500 text-xs mt-2"
      >
        Delete
      </button>
    </div>
  );
}
