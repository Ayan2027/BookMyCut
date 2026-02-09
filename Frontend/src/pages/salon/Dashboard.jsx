import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const { salon } = useSelector((s) => s.salon);
  const { list: services } = useSelector((s) => s.service);
  const { list: slots } = useSelector((s) => s.slot);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">
          {salon?.name || "Salon Dashboard"}
        </h2>
        <p className="text-gray-500">
          {salon?.city} • Status: {salon?.status}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Services" value={services.length} />
        <StatCard label="Slots" value={slots.length} />
        <StatCard label="Wallet" value="₹0" />
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

        <div className="flex gap-3">
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => navigate("/salon/services")}
          >
            Add Service
          </button>

          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => navigate("/salon/slots")}
          >
            Generate Slots
          </button>

          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => navigate("/salon/bookings")}
          >
            View Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white shadow rounded-2xl p-6 text-center">
      <p className="text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
