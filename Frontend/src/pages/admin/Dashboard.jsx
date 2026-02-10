// src/pages/admin/Dashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOverview, approveSalon, rejectSalon, suspendSalon } from "../../redux/admin/adminThunks";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingList, pendingCount, salonsCount, bookingsCount, paymentsCount, loading } = useSelector(s => s.admin);

  useEffect(() => {
    dispatch(fetchAdminOverview());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveSalon(id)).then(() => dispatch(fetchAdminOverview()));
  };

  const handleReject = (id) => {
    // optional: prompt for reason later; for now simple reject
    dispatch(rejectSalon({ salonId: id, reason: "Rejected by admin" })).then(() => dispatch(fetchAdminOverview()));
  };

  const handleSuspend = (id) => {
    dispatch(suspendSalon(id)).then(() => dispatch(fetchAdminOverview()));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-gray-500">Overview & quick actions</p>
        </div>

        <div className="flex gap-4">
          <Stat label="Pending salons" value={pendingCount} />
          <Stat label="Total salons" value={salonsCount} />
          <Stat label="Bookings" value={bookingsCount} />
          <Stat label="Payments" value={paymentsCount} />
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent pending applications</h2>
          <button className="text-sm text-blue-600" onClick={() => navigate("/admin/salons")}>
            View all applications →
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && pendingList.length === 0 && (
          <p className="text-gray-500">No pending applications right now.</p>
        )}

        <div className="space-y-3">
          {pendingList.map((s) => (
            <div key={s._id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-500">{s.address} • {s.city}</p>
                <p className="text-sm text-gray-500">Owner: {s.ownerEmail || s.ownerName || s.ownerAccountId || "—"}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleApprove(s._id)} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                <button onClick={() => handleReject(s._id)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                <button onClick={() => handleSuspend(s._id)} className="bg-yellow-600 text-white px-3 py-1 rounded">Suspend</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center p-3">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
