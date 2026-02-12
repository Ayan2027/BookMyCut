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

  // Group slots by date (for IRCTC-like sections)
  const grouped = list.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

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
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold">Generate Slots</h3>

        <div className="flex gap-3 items-center">
          <input
            type="date"
            className="border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={submit}
            className="bg-black text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-900 transition"
          >
            Generate 9AM–8PM
          </button>
        </div>
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

        {/* Grouped by date */}
        <div className="space-y-6">
          {Object.keys(grouped).map((date) => (
            <div key={date}>
              <div className="mb-3">
                <h4 className="text-lg font-semibold text-black">
                  {date}
                </h4>
                <div className="h-px bg-gray-200 mt-1" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {grouped[date].map((slot) => (
                  <SlotCard
                    key={slot._id}
                    slot={slot}
                    onDelete={() => dispatch(deleteSlot(slot._id))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlotCard({ slot, onDelete }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 text-center bg-white hover:shadow-md transition">
      <p className="text-lg font-semibold text-black">
        {slot.startTime}
      </p>

      <p className="text-xs text-gray-400">
        to {slot.endTime}
      </p>

      <button
        onClick={onDelete}
        className="mt-3 text-xs text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
}
