import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// FIXED: Corrected Icon names (PascalCase) and added missing imports
import { Calendar, Clock, CreditCard, XCircle, CheckCircle2, Timer, Package, AlertCircle } from "lucide-react";
import { fetchMyBookings, updateBookingStatus } from "../../redux/booking/bookingThunks";

export default function UserBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((s) => s.booking);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      
      {/* 1. HEADER SECTION */}
      <header className="relative p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[100px] -z-10" />
        <div className="relative z-10">
          <h2 className="text-5xl font-black tracking-tighter italic bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent uppercase text-left">
            RESERVATIONS
          </h2>
          <p className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] mt-2 uppercase text-left">
            Transactional Appointment History
          </p>
        </div>
      </header>

      {/* 2. CONTENT AREA */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center border border-white/5 rounded-[2.5rem] bg-white/[0.01] animate-pulse">
            <p className="text-zinc-600 font-mono uppercase tracking-widest italic">Syncing Ledger...</p>
          </div>
        ) : bookings?.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-[2.5rem] text-zinc-700 italic">
             No appointment records detected in the local stream.
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings?.map((b) => (
              <BookingCard
                key={b._id}
                booking={b}
                onCancel={() =>
                  dispatch(
                    updateBookingStatus({
                      id: b._id,
                      status: "CANCELLED"
                    })
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// FIXED: Configuration for status UI
const statusConfig = {
  PENDING: {
    label: "Awaiting Approval",
    color: "text-amber-400",
    bg: "bg-amber-400/5",
    border: "border-amber-400/20",
    icon: <Timer size={14} /> // Fixed case
  },
  ACCEPTED: {
    label: "Confirmed",
    color: "text-emerald-400",
    bg: "bg-emerald-400/5",
    border: "border-emerald-400/20",
    icon: <CheckCircle2 size={14} />
  },
  COMPLETED: {
    label: "Fulfilled",
    color: "text-sky-400",
    bg: "bg-sky-400/5",
    border: "border-sky-400/20",
    icon: <Package size={14} />
  },
  CANCELLED: {
    label: "Terminated",
    color: "text-rose-500",
    bg: "bg-rose-500/5",
    border: "border-rose-500/20",
    icon: <XCircle size={14} />
  }
};

function BookingCard({ booking, onCancel }) {
  const config = statusConfig[booking.status] || statusConfig.PENDING;
  const canCancel = booking.status === "PENDING";

  return (
    <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:border-white/10 transition-all duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        {/* INFO SECTION */}
        <div className="flex-1 space-y-4 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-2xl font-bold tracking-tight text-white italic uppercase">
              {booking.services?.map((s) => s.name).join(" + ")}
            </h4>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${config.bg} ${config.border} ${config.color}`}>
              {config.icon}
              <span className="text-[10px] font-black uppercase tracking-widest">{booking.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
            <DataPoint icon={<Calendar size={14}/>} label="SCHEDULED_DATE" value={booking.slot?.date} />
            <DataPoint icon={<Clock size={14}/>} label="START_TIME" value={booking.slot?.startTime} />
            <DataPoint icon={<CreditCard size={14}/>} label="VALUATION" value={`₹${booking.totalAmount}`} />
          </div>
          
          <p className="text-[11px] font-medium text-zinc-500 italic text-left">
            {config.label}
          </p>
        </div>

        {/* ACTIONS SECTION */}
        {canCancel && (
          <button
            onClick={onCancel}
            className="relative px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <XCircle size={14} />
              Terminate Booking
            </span>
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-50 group-hover:via-violet-500/50 transition-all duration-700" />
    </div>
  );
}

// FIXED: Added missing DataPoint component logic
function DataPoint({ icon, label, value }) {
  return (
    <div className="space-y-1 text-left">
      <div className="flex items-center gap-2 text-zinc-600">
        {icon}
        <span className="text-[9px] font-mono font-bold tracking-widest uppercase">{label}</span>
      </div>
      <p className="text-sm font-bold text-zinc-300 tracking-tight">{value || "N/A"}</p>
    </div>
  );
}