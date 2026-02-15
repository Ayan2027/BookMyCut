import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../services/api";

export default function BookSlot() {
  const { salonId } = useParams();
  const [search] = useSearchParams();
  const serviceId = search.get("service");

  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get(`/salons/${salonId}/slots`).then((res) => {
      setSlots(res.data);
    });
  }, []);

  const book = async () => {
    await api.post("/bookings", {
      serviceId,
      slotId: selected
    });

    alert("Booking successful");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Choose Slot</h2>

      <div className="grid grid-cols-5 gap-2">
        {slots.map((slot) => (
          <button
            key={slot._id}
            className={`border p-2 rounded ${
              selected === slot._id ? "border-black" : ""
            }`}
            onClick={() => setSelected(slot._id)}
          >
            {slot.startTime}
          </button>
        ))}
      </div>

      <button
        disabled={!selected}
        className="bg-black text-white px-4 py-2 rounded"
        onClick={book}
      >
        Confirm Booking
      </button>
    </div>
  );
}
