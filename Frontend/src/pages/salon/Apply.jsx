import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applySalon } from "../../redux/salon/salonThunks";
import { useNavigate } from "react-router-dom";

export default function Apply() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { exists, loading } = useSelector((s) => s.salon);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    description: ""
  });

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    const res = await dispatch(applySalon(form));

    if (applySalon.fulfilled.match(res)) {
      navigate("/salon/application-status");
    }
  };

  useEffect(() => {
    if (exists) {
      navigate("/salon/application-status");
    }
  }, [exists]);

  return (
    <div className="flex justify-center py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[500px]">
        <h2 className="text-2xl font-semibold mb-6">
          Apply as TrimBhai Partner
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Salon Name"
            onChange={(e) => update("name", e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Address"
            onChange={(e) => update("address", e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="City"
            onChange={(e) => update("city", e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Phone"
            onChange={(e) => update("phone", e.target.value)}
          />

          <textarea
            className="w-full border p-2 rounded"
            placeholder="Description"
            onChange={(e) => update("description", e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
