// src/pages/admin/Dashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminOverview,
  approveSalon,
  rejectSalon,
  suspendSalon,
} from "../../redux/admin/adminThunks";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Store,
  Calendar,
  CreditCard,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    pendingList,
    pendingCount,
    salonsCount,
    bookingsCount,
    paymentsCount,
    loading,
  } = useSelector((s) => s.admin);

  useEffect(() => {
    console.log("Admin dashboard mounted");
    dispatch(fetchAdminOverview());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveSalon(id)).then(() => dispatch(fetchAdminOverview()));
  };

  const handleReject = (id) => {
    dispatch(rejectSalon({ salonId: id, reason: "Rejected by admin" })).then(
      () => dispatch(fetchAdminOverview()),
    );
  };

  const handleSuspend = (id) => {
    dispatch(suspendSalon(id)).then(() => dispatch(fetchAdminOverview()));
  };

  const stats = [
    {
      label: "Pending Approvals",
      value: pendingCount,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      label: "Total Salons",
      value: salonsCount,
      icon: Store,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Total Bookings",
      value: bookingsCount,
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Payments",
      value: paymentsCount,
      icon: CreditCard,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage salons, bookings, and monitor platform activity
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>

        {/* Pending Applications */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">
                  Pending Applications
                </h2>
                <p className="text-sm text-slate-600">
                  Review and approve salon registrations
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/salons")}
                className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 transition-all duration-200 text-sm font-medium text-slate-700 hover:text-indigo-600"
              >
                View all applications
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="p-8">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {!loading && pendingList.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">
                  No pending applications at the moment
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  All salon registrations have been processed
                </p>
              </div>
            )}

            <div className="space-y-4">
              {pendingList.map((s) => (
                <ApplicationCard
                  key={s._id}
                  salon={s}
                  onApprove={() => handleApprove(s._id)}
                  onReject={() => handleReject(s._id)}
                  onSuspend={() => handleSuspend(s._id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-7 h-7 ${stat.textColor}`} />
        </div>
        <div
          className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white shadow-md`}
        >
          Live
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-slate-800 tracking-tight">
          {stat.value?.toLocaleString() || 0}
        </div>
        <div className="text-sm font-medium text-slate-500">{stat.label}</div>
      </div>
    </div>
  );
}

function ApplicationCard({ salon, onApprove, onReject, onSuspend }) {
  return (
    <div className="group bg-gradient-to-br from-white to-slate-50 rounded-xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">
                {salon.name}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  {salon.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  {salon.city}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-15">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              Owner:{" "}
              <span className="font-medium text-slate-700">
                {salon.ownerEmail ||
                  salon.ownerName ||
                  salon.ownerAccountId ||
                  "—"}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:flex-shrink-0">
          <button
            onClick={onApprove}
            className="group/btn flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 hover:-translate-y-0.5"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={onReject}
            className="group/btn flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300 hover:-translate-y-0.5"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
          <button
            onClick={onSuspend}
            className="group/btn flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 hover:-translate-y-0.5"
          >
            <AlertCircle className="w-4 h-4" />
            Suspend
          </button>
        </div>
      </div>
    </div>
  );
}