import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function BookService() {
  const { salonId } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get(`/salons/${salonId}/services`).then((res) => {
      setServices(res.data);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Choose Service</h2>

      <div className="grid grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s._id}
            className={`border rounded-xl p-4 cursor-pointer ${
              selected === s._id ? "border-black" : ""
            }`}
            onClick={() => setSelected(s._id)}
          >
            <p className="font-medium">{s.name}</p>
            <p className="text-gray-500">₹{s.price}</p>
          </div>
        ))}
      </div>

      <button
        disabled={!selected}
        className="bg-black text-white px-4 py-2 rounded"
        onClick={() =>
          navigate(`/app/salons/${salonId}/slots?service=${selected}`)
        }
      >
        Continue
      </button>
    </div>
  );
}
