import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Clock, CreditCard, XCircle, CheckCircle2, Timer, Package, Star, ShieldCheck, Zap } from "lucide-react";
import { fetchMyBookings, updateBookingStatus } from "../../redux/booking/bookingThunks";
import api from "../../services/api"; // ✅ Using your Axios instance

export default function UserBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((s) => s.booking);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* HEADER */}
        <header className="relative p-12 rounded-[3rem] bg-white/[0.01] border border-white/5 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[130px] -z-10 animate-pulse" />
          <h2 className="text-6xl font-black tracking-tighter italic text-white uppercase leading-none text-left">
            Reservations
          </h2>
          <p className="text-zinc-500 font-mono text-[10px] tracking-[0.5em] mt-4 uppercase text-left opacity-70">
            Authenticated Transactional History
          </p>
        </header>

        {/* LIST */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-24 text-center border border-white/5 rounded-[3rem] bg-white/[0.01] animate-pulse font-mono uppercase tracking-widest italic">
              Syncing Data Stream...
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
  const [submitting, setSubmitting] = useState(false);
  
  const config = statusConfig[booking.status] || statusConfig.PENDING;
  
  // ✅ Check if booking is completed AND rating exists
  const isCompleted = booking.status === "COMPLETED";
  const ratingValue = booking.rating || 0; 
  const hasReviewed = ratingValue > 0;

  const handleRating = async (val) => {
    if (submitting || hasReviewed || !isCompleted) return;
    
    setSubmitting(true);
    try {
      await api.post("/reviews", { 
        bookingId: booking._id, 
        rating: val 
      });
      // ✅ Refresh is critical here to fetch the new rating from the DB
      refresh(); 
    } catch (err) {
      console.error("Transmission failed", err.response?.data?.message || err.message);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="group relative bg-[#070707] border border-white/5 rounded-[2.5rem] p-1 transition-all duration-500 hover:border-violet-500/30">
      <div className="p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        
        {/* INFO SECTION */}
        <div className="flex-1 space-y-6 text-left">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${config.bg} ${config.border} ${config.color}`}>
              {config.icon} {booking.status}
            </div>
            <span className="text-zinc-800 font-mono text-[10px]">ID-{booking._id.slice(-6).toUpperCase()}</span>
          </div>

          <h4 className="text-3xl font-bold text-white uppercase italic tracking-tighter leading-tight">
            {booking.services?.map(s => s.name).join(" + ")}
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <DataPoint label="Date" value={booking.slot?.date} />
            <DataPoint label="Time" value={booking.slot?.startTime} />
            <DataPoint label="Total" value={`₹${booking.totalAmount}`} color="text-violet-400" />
          </div>
        </div>

        {/* INTERACTIVE RATING ZONE */}
        <div className="w-full lg:w-72 lg:pl-10 lg:border-l border-white/5 flex flex-col justify-center min-h-[100px]">
          {isCompleted ? (
            hasReviewed ? (
              /* ✅ SHOW ONLY THE RATING (Read Only) */
              <div className="flex flex-col items-start lg:items-end gap-3 animate-in fade-in duration-700">
                 <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Your Rating</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      size={20} 
                      className={`${s <= ratingValue ? "fill-violet-500 text-violet-500" : "text-zinc-800"}`} 
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-emerald-500/50">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-tighter">Verified Review</span>
                </div>
              </div>
            ) : (
              /* ✅ SHOW RATING INPUT (Only if not reviewed) */
              <div className={`flex flex-col items-start lg:items-end gap-4 ${submitting ? "opacity-30 pointer-events-none" : ""}`}>
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-amber-500 fill-amber-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Rate Service</span>
                </div>
                <div className="flex gap-2 p-3 bg-white/[0.03] rounded-2xl border border-white/5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => handleRating(s)}
                      className="transition-transform hover:scale-125 active:scale-95"
                    >
                      <Star 
                        size={24} 
                        className={`transition-colors duration-200 ${s <= (hover || 0) ? "fill-white text-white" : "text-zinc-800"}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            /* SHOW STATUS MESSAGE IF NOT COMPLETED */
            <div className="opacity-40 text-left lg:text-right">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Status</p>
              <p className="text-xs italic text-zinc-500">{config.label}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const statusConfig = {
  PENDING: { label: "Awaiting approval.", color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20", icon: <Timer size={14} /> },
  ACCEPTED: { label: "Confirmed.", color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/20", icon: <CheckCircle2 size={14} /> },
  COMPLETED: { label: "Service fulfilled.", color: "text-sky-400", bg: "bg-sky-400/5", border: "border-sky-400/20", icon: <Package size={14} /> },
  CANCELLED: { label: "Terminated.", color: "text-rose-500", bg: "bg-rose-500/5", border: "border-rose-500/20", icon: <XCircle size={14} /> }
};

function DataPoint({ label, value, color = "text-zinc-300" }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-bold tracking-tight ${color}`}>{value || "N/A"}</p>
    </div>
  );
}