import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSalon, fetchMySalon } from "../../redux/salon/salonThunks";

export default function Profile() {
  const dispatch = useDispatch();
  const { salon } = useSelector((s) => s.salon);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    description: ""
  });

  useEffect(() => {
    dispatch(fetchMySalon());
  }, [dispatch]);

  useEffect(() => {
    if (salon) {
      setForm({
        name: salon.name || "",
        address: salon.address || "",
        city: salon.city || "",
        phone: salon.phone || "",
        description: salon.description || ""
      });
    }
  }, [salon]);

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const save = () => {
    dispatch(updateSalon(form));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Salon Profile</h2>
        <p className="text-gray-500">
          Update your salon information
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Salon Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Address"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="City"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />

        <textarea
          className="border p-2 rounded w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <button
          onClick={save}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
