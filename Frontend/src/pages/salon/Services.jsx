import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyServices,
  createService,
  deleteService
} from "../../redux/service/serviceThunks";

export default function Services() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.service);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: ""
  });

  useEffect(() => {
    dispatch(fetchMyServices());
  }, [dispatch]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name || !form.price || !form.duration) return;
    dispatch(createService(form));
    setForm({ name: "", price: "", duration: "" });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Services</h2>
        <p className="text-gray-500">
          Manage services offered by your salon
        </p>
      </div>

      {/* ADD SERVICE */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-3">
        <h3 className="font-semibold">Add New Service</h3>

        <div className="grid grid-cols-3 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Service name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Price"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Duration (min)"
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
          />
        </div>

        <button
          onClick={submit}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Service
        </button>
      </div>

      {/* SERVICES LIST */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Your Services</h3>

        {loading && <p>Loading services...</p>}

        {!loading && list.length === 0 && (
          <p className="text-gray-500">
            No services added yet.
          </p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {list.map((s) => (
            <ServiceCard
              key={s._id}
              service={s}
              onDelete={() => dispatch(deleteService(s._id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, onDelete }) {
  return (
    <div className="border rounded-2xl p-4 shadow-sm">
      <h4 className="font-semibold">{service.name}</h4>
      <p className="text-gray-500">₹{service.price}</p>
      <p className="text-gray-500">{service.duration} minutes</p>

      <button
        onClick={onDelete}
        className="text-red-500 mt-3 text-sm"
      >
        Delete
      </button>
    </div>
  );
}
