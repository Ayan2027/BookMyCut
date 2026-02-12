import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchAdminOverview,
  approveSalon,
  rejectSalon,
  suspendSalon
} from "../../redux/admin/adminThunks";
import { adminService } from "../../services/admin.service";
import {
  Store,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Filter,
  Search,
} from "lucide-react";

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

  const statusConfig = [
    {
      value: "PENDING",
      label: "Pending",
      icon: Clock,
      color: "amber",
      count: list.length,
    },
    {
      value: "APPROVED",
      label: "Approved",
      icon: CheckCircle,
      color: "emerald",
      count: list.length,
    },
    {
      value: "REJECTED",
      label: "Rejected",
      icon: XCircle,
      color: "red",
      count: list.length,
    },
    {
      value: "SUSPENDED",
      label: "Suspended",
      icon: AlertCircle,
      color: "orange",
      count: list.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                  Salon Applications
                </h2>
                <p className="text-slate-600">
                  Review, approve, and manage all salon registrations on the
                  platform
                </p>
              </div>
            </div>

            {/* Search Bar - Optional Enhancement */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search salons..."
                className="pl-12 pr-4 py-3 w-full lg:w-80 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-2 mb-8 border border-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {statusConfig.map((s) => {
              const Icon = s.icon;
              const isActive = status === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`group relative px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-br from-${s.color}-500 to-${s.color}-600 text-white shadow-lg shadow-${s.color}-200`
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2.5">
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-white" : `text-${s.color}-500`}`}
                    />
                    <span>{s.label}</span>
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Info Bar */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-slate-700">
                Showing {list.length} {status.toLowerCase()} salon
                {list.length !== 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={load}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {list.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-16 border border-slate-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-lg font-semibold text-slate-700 mb-2">
                  No salons found
                </p>
                <p className="text-slate-500">
                  There are no {status.toLowerCase()} salon applications at the
                  moment.
                </p>
              </div>
            </div>
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
    </div>
  );
}

function SalonRow({ salon, onApprove, onReject, onSuspend }) {
  const getStatusBadge = (status) => {
    const configs = {
      PENDING: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        label: "Pending Review",
      },
      APPROVED: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        label: "Approved",
      },
      REJECTED: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        label: "Rejected",
      },
      SUSPENDED: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        label: "Suspended",
      },
    };

    const config = configs[status] || configs.PENDING;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-current" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 border border-slate-100 hover:border-indigo-200 transition-all duration-300 overflow-hidden">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Salon Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-800 truncate">
                    {salon.name}
                  </h3>
                  {getStatusBadge(salon.status)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm">{salon.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm font-medium">{salon.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:flex-shrink-0">
            {salon.status === "PENDING" && (
              <>
                <button
                  onClick={onApprove}
                  className="group/btn flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>

                <button
                  onClick={onReject}
                  className="group/btn flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:-translate-y-0.5"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </>
            )}

            {salon.status === "APPROVED" && (
              <button
                onClick={onSuspend}
                className="group/btn flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5"
              >
                <AlertCircle className="w-5 h-5" />
                Suspend
              </button>
            )}

            {(salon.status === "REJECTED" || salon.status === "SUSPENDED") && (
              <button
                onClick={onApprove}
                className="group/btn flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5"
              >
                <CheckCircle className="w-5 h-5" />
                Reactivate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effect Bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}