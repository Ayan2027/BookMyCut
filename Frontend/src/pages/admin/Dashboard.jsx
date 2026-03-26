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
  Activity,
  ShieldCheck,
  ChevronRight,
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
    finance,
  } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminOverview());
  }, [dispatch]);

  const stats = [
    {
      label: "Pending_Approval",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-500",
      glow: "shadow-amber-500/20",
    },
    {
      label: "Salons",
      value: salonsCount,
      icon: Store,
      color: "text-blue-500",
      glow: "shadow-blue-500/20",
    },
    {
      label: "Total_Bookings",
      value: bookingsCount,
      icon: Calendar,
      color: "text-violet-500",
      glow: "shadow-violet-500/20",
    },
    {
      label: "Payment",
      value: paymentsCount,
      icon: CreditCard,
      color: "text-emerald-500",
      glow: "shadow-emerald-500/20",
    },
  ];
  const financialStats = [
    {
      label: "Revenue",
      value: `₹${finance.totalRevenue}`,
      icon: TrendingUp,
      color: "text-green-500",
      glow: "shadow-green-500/20",
    },
    {
      label: "Collected",
      value: `₹${finance.totalAmount}`,
      icon: CreditCard,
      color: "text-blue-500",
      glow: "shadow-blue-500/20",
    },
    {
      label: "Pending_Payouts",
      value: `₹${finance.pendingPayouts}`,
      icon: Clock,
      color: "text-yellow-500",
      glow: "shadow-yellow-500/20",
    },
    {
      label: "Earned by Salons",
      value: `₹${finance.paidToSalons}`,
      icon: CheckCircle,
      color: "text-emerald-500",
      glow: "shadow-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-10 selection:bg-violet-500/30 pb-12">
      {/* 1. KERNEL HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-violet-500 font-mono text-[10px] tracking-[0.4em] uppercase">
            <Activity size={14} /> System_Pulse: Active
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Dashboard_ <br />
            <span className="text-zinc-500 outline-text">OVERVIEW</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
          <div className="text-right">
            <p className="text-[9px] font-mono text-zinc-600 uppercase">
              Last_Sync
            </p>
            <p className="text-xs font-bold text-zinc-300 font-mono">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <ShieldCheck className="text-emerald-500" size={24} />
        </div>
      </header>

      {/* 2. STATS GRID: DATA_POINTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group relative bg-[#080808] border border-white/5 rounded-3xl p-6 transition-all duration-500 hover:border-white/20"
          >
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 h-1 w-20 rounded-full transition-all duration-500 opacity-20 group-hover:opacity-100 ${stat.color.replace("text", "bg")} ${stat.glow}`}
            />
            <div className="flex items-start justify-between mb-8">
              <div
                className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}
              >
                <stat.icon size={24} />
              </div>
              <TrendingUp size={14} className="text-zinc-800" />
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-black tracking-tighter italic font-mono uppercase leading-none">
                {stat.value || 0}
              </div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, idx) => (
          <div
            key={idx}
            className="group relative bg-[#080808] border border-white/5 rounded-3xl p-6"
          >
            <div className="flex justify-between mb-4">
              <stat.icon className={stat.color} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 3. PENDING APPLICATIONS: SECTOR_REVIEW */}
      <section className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">
              Application_Queue
            </h2>
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest italic">
              Reviewing pending nodes for network integration
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/salons")}
            className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:bg-white hover:text-black transition-all duration-500"
          >
            Full_Registry{" "}
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-20">
              <Loader2 className="animate-spin" size={40} />
              <span className="text-[10px] font-mono uppercase tracking-widest">
                Compiling_Queue...
              </span>
            </div>
          ) : pendingList.length === 0 ? (
            <div className="py-20 text-center space-y-4 opacity-40">
              <CheckCircle className="mx-auto text-zinc-700" size={40} />
              <p className="text-[10px] font-mono uppercase tracking-[0.4em]">
                Queue_Clear: Zero_Tasks_Detected
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingList.map((s) => (
                <ApplicationRow
                  key={s._id}
                  salon={s}
                  onApprove={() =>
                    dispatch(approveSalon(s._id)).then(() =>
                      dispatch(fetchAdminOverview()),
                    )
                  }
                  onReject={() =>
                    dispatch(
                      rejectSalon({
                        salonId: s._id,
                        reason: "Manual_Override",
                      }),
                    ).then(() => dispatch(fetchAdminOverview()))
                  }
                  onSuspend={() =>
                    dispatch(suspendSalon(s._id)).then(() =>
                      dispatch(fetchAdminOverview()),
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ApplicationRow({ salon, onApprove, onReject, onSuspend }) {
  return (
    <div className="group bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 transition-all duration-500 hover:bg-white/[0.03] hover:border-white/10">
      <div className="flex items-center gap-6">
        <div className="h-16 w-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 border border-white/5">
          <img
            src={
              salon.image ||
              "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=100"
            }
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tighter italic uppercase leading-none">
            {salon.name}
          </h3>
          <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <MapPin size={10} /> {salon.city}
            </span>
            <span className="h-1 w-1 bg-zinc-800 rounded-full" />
            <span>Owner: {salon.ownerName || "External_Node"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ActionButton
          onClick={onApprove}
          label="Approve"
          icon={CheckCircle}
          color="hover:bg-emerald-500"
        />
        <ActionButton
          onClick={onReject}
          label="Reject"
          icon={XCircle}
          color="hover:bg-red-500"
        />
        <ActionButton
          onClick={onSuspend}
          label="Suspend"
          icon={AlertCircle}
          color="hover:bg-amber-500"
        />
      </div>
    </div>
  );
}

function ActionButton({ onClick, label, icon: Icon, color }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-zinc-500 transition-all duration-300 ${color} hover:text-black hover:scale-105 active:scale-95`}
    >
      <Icon size={14} /> {label}
    </button>
  );
}

const Loader2 = ({ className, size }) => (
  <Activity className={`${className} text-violet-500`} size={size} />
);
const MapPin = ({ size }) => <Store size={size} className="text-zinc-700" />;
