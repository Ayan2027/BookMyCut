import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchAdminOverview,
  approveSalon,
  rejectSalon,
  suspendSalon
} from "../../redux/admin/adminThunks";
import { adminService } from "../../services/admin.service";

export default function AdminSalons() {
  const dispatch = useDispatch();

  const [status, setStatus] = useState("PENDING");
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, [status]);

  const load = async () => {
    try {
      const res = await adminService.getSalonsByStatus(status);
      setList(res.data);
    } catch (err) {
      console.error("Failed to load salons:", err);
      setList([]);
    }
  };

  const approve = async (id) => {
    await dispatch(approveSalon(id));
    load();
    dispatch(fetchAdminOverview());
  };

  const reject = async (id) => {
    await dispatch(
      rejectSalon({ salonId: id, reason: "Rejected by admin" })
    );
    load();
    dispatch(fetchAdminOverview());
  };

  const suspend = async (id) => {
    await dispatch(suspendSalon(id));
    load();
    dispatch(fetchAdminOverview());
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">
          Salon Applications
        </h2>
        <p className="text-gray-500">
          Approve or manage salon registrations
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-2">
        {["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded ${
              status === s
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-3">
        {list.length === 0 && (
          <p className="text-gray-500">No salons found.</p>
        )}

        {list.map((salon) => (
          <SalonRow
            key={salon._id}
            salon={salon}
            onApprove={() => approve(salon._id)}
            onReject={() => reject(salon._id)}
            onSuspend={() => suspend(salon._id)}
          />
        ))}
      </div>
    </div>
  );
}

function SalonRow({ salon, onApprove, onReject, onSuspend }) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{salon.name}</p>
        <p className="text-gray-500">
          {salon.city} • {salon.phone}
        </p>
        <p className="text-sm">Status: {salon.status}</p>
      </div>

      <div className="flex gap-2">
        {salon.status === "PENDING" && (
          <>
            <button
              onClick={onApprove}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>

            <button
              onClick={onReject}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </>
        )}

        {salon.status === "APPROVED" && (
          <button
            onClick={onSuspend}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Suspend
          </button>
        )}
      </div>
    </div>
  );
}
