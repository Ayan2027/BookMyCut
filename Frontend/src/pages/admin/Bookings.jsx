import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Clock, CreditCard, XCircle, CheckCircle2, Timer, Package, Star, ShieldCheck, Zap } from "lucide-react";
import { fetchMyBookings, updateBookingStatus } from "../../redux/booking/bookingThunks";
import api from "../../services/api"; 

export default function UserBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((s) => s.booking);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ADVANCED HEADER */}
        <header className="relative p-12 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 blur-[120px] -z-10" />
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-violet-500" />
            <span className="text-violet-500 font-mono text-[10px] tracking-[0.5em] uppercase">System Ledger</span>
          </div>
          <h2 className="text-7xl font-black tracking-tighter italic text-white uppercase leading-none">
            Reservations
          </h2>
        </header>

        {/* CONTENT */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-24 text-center border border-white/5 rounded-[3rem] bg-white/[0.01] animate-pulse">
              <p className="text-zinc-600 font-mono uppercase tracking-[0.3em] italic">Synchronizing Data-Stream...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings?.map((b) => (
                <BookingCard 
                  key={b._id} 
                  booking={b} 
                  refresh={() => dispatch(fetchMyBookings())}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, refresh }) {
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const config = statusConfig[booking.status] || statusConfig.PENDING;
  const isCompleted = booking.status === "COMPLETED";
  // Logic: If booking.rating exists in the DB, we lock the card.
  const hasReviewed = booking.rating > 0;

  const handleRating = async (val) => {
    if (isSubmitting || hasReviewed) return;
    setIsSubmitting(true);
    try {
      await api.post("/reviews", { bookingId: booking._id, rating: val });
      await refresh(); // Refresh Redux state to get the new booking.rating
    } catch (err) {
      console.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.01] transition-all duration-500 hover:border-white/10 hover:bg-white/[0.02]">
      <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
        
        {/* LEFT: STATUS & MAIN INFO */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${config.bg} ${config.border} ${config.color}`}>
              {config.icon} {booking.status}
            </div>
            <span className="text-zinc-700 font-mono text-[10px]">/ / ID-{booking._id.slice(-6)}</span>
          </div>

          <h4 className="text-3xl font-bold text-white uppercase italic tracking-tighter">
            {booking.services?.map(s => s.name).join(" + ")}
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <DataPoint label="Timestamp" value={booking.slot?.date} />
            <DataPoint label="Window" value={booking.slot?.startTime} />
            <DataPoint label="Value" value={`₹${booking.totalAmount}`} color="text-violet-400" />
          </div>
        </div>

        {/* RIGHT: INTERACTIVE RATING ZONE */}
        <div className="w-full lg:w-72 pt-6 lg:pt-0 lg:border-l border-white/5 lg:pl-10">
          {isCompleted ? (
            hasReviewed ? (
              /* COMPLETED & REVIEWED: Show static stars */
              <div className="space-y-3 animate-in fade-in zoom-in duration-700">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Rating Recorded</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} className={`${s <= booking.rating ? "fill-violet-500 text-violet-500" : "text-zinc-800"}`} />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-emerald-500/50">
                  <ShieldCheck size={14} />
                  <span className="text-[9px] font-black uppercase tracking-tighter">Verified Review</span>
                </div>
              </div>
            ) : (
              /* COMPLETED & NOT REVIEWED: Show input */
              <div className={`space-y-4 transition-all duration-500 ${isSubmitting ? "opacity-20 scale-95" : ""}`}>
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-amber-400 fill-amber-400" />
                  <p className="text-[10px] font-mono text-white uppercase tracking-[0.2em]">Pending Feedback</p>
                </div>
                <div className="flex gap-2 bg-white/[0.03] w-fit p-3 rounded-2xl border border-white/5 shadow-inner">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => handleRating(s)}
                      className="transition-all hover:scale-125 active:scale-90"
                    >
                      <Star 
                        size={24} 
                        className={`transition-all duration-300 ${s <= (hover || 0) ? "fill-white text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-zinc-800"}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            /* NOT COMPLETED */
            <div className="opacity-40">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Notice</p>
              <p className="text-[11px] italic text-zinc-400">{config.label}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DataPoint({ label, value, color = "text-zinc-300" }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-bold tracking-tight ${color}`}>{value || "N/A"}</p>
    </div>
  );
}

const statusConfig = {
  PENDING: { label: "Review unlocks after fulfillment", color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20", icon: <Timer size={14} /> },
  ACCEPTED: { label: "Awaiting service delivery", color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/20", icon: <CheckCircle2 size={14} /> },
  COMPLETED: { label: "Fulfilled", color: "text-sky-400", bg: "bg-sky-400/5", border: "border-sky-400/20", icon: <Package size={14} /> },
  CANCELLED: { label: "Transaction Void", color: "text-rose-500", bg: "bg-rose-500/5", border: "border-rose-500/20", icon: <XCircle size={14} /> }
};