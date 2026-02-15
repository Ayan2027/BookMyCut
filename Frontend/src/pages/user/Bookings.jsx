import { useEffect, useState } from "react";
import api from "../../services/api";

export default function UserBookings() {
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/bookings/me");
    setList(res.data);
  };

  return (
    <div className="p-6 space-y-3">
      <h2 className="text-xl font-semibold">My Bookings</h2>

      {list.map((b) => (
        <div key={b._id} className="border p-3 rounded">
          <p>{b.serviceName}</p>
          <p>{b.slotTime}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}
