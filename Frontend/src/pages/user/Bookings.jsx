import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // Add: npm install framer-motion
import {
  Calendar,
  Clock,
  CreditCard,
  XCircle,
  CheckCircle2,
  Timer,
  Package,
  Star,
  ShieldCheck,
  Zap,
  Navigation,
  ArrowUpRight,
} from "lucide-react";
import { fetchMyBookings } from "../../redux/booking/bookingThunks";
import api from "../../services/api";

// --- Advanced Status Configuration ---
const statusConfig = {
  PENDING: {
    label: "PENDING",
    color: "text-amber-400",
    glow: "shadow-amber-500/20",
    bg: "bg-amber-400/10",
    icon: Timer,
  },
  ACCEPTED: {
    label: "CONFIRMED",
    color: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    bg: "bg-emerald-400/10",
    icon: CheckCircle2,
  },
  COMPLETED: {
    label: "FULFILLED",
    color: "text-sky-400",
    glow: "shadow-sky-500/20",
    bg: "bg-sky-400/10",
    icon: Package,
  },
  CANCELLED: {
    label: "CANCELLED",
    color: "text-rose-500",
    glow: "shadow-rose-500/20",
    bg: "bg-rose-500/10",
    icon: XCircle,
  },
};

export default function UserBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((s) => s.booking);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-8 lg:p-12 selection:bg-violet-500/30">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* ENHANCED HEADER */}
        <header className="relative group p-12 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/20 blur-[120px] rounded-full group-hover:bg-violet-600/30 transition-all duration-700" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic text-white uppercase leading-none italic">
              Track Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">
                Bookings
              </span>
            </h2>
            <div className="flex items-center gap-4 mt-6">
              <span className="h-[1px] w-12 bg-violet-500/50" />
              <p className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] uppercase opacity-80">
                Secure Booking Registry // {bookings?.length || 0} Records
              </p>
            </div>
          </motion.div>
        </header>

        {/* LIST WITH ANIMATED PRESENCE */}
        <div className="space-y-8">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center border border-white/5 rounded-[3rem] bg-white/[0.01]">
              <div className="w-12 h-12 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4" />
              <p className="font-mono text-xs tracking-widest uppercase animate-pulse">
                Synchronizing Data...
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              <AnimatePresence>
                {bookings?.map((b, index) => (
                  <BookingCard
                    key={b._id}
                    booking={b}
                    index={index}
                    refresh={() => dispatch(fetchMyBookings())}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, refresh, index }) {
  const [hover, setHover] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [submitting, setSubmitting] = useState(false);

  const config = statusConfig[booking?.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  // Spotlight effect logic
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCancel = async (bookingId, refresh, setSubmitting) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? Refunds are calculated based on time remaining before the slot.",
    );
    if (!confirmCancel) return;

    setSubmitting(true);
    try {
      // Matches your route: router.patch("/:bookingId/cancel", cancelBooking)
      const response = await api.patch(`/bookings/${bookingId}/cancel`, {
        cancelledBy: "USER",
      });

      alert(
        `Cancelled successfully! Refund processed: ₹${response.data.refundAmount}`,
      );
      refresh();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Cancellation failed";
      alert(errorMsg);
      console.error("Transmission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isCompleted = booking?.status === "COMPLETED";
  const ratingValue = booking?.rating || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative bg-zinc-950/50 border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-violet-500/5"
    >
      {/* SPOTLIGHT GRADIENT */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.06), transparent 40%)`,
        }}
      />

      <div className="relative z-10 p-8 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* SECTION: LEFT - IDENTITY */}
        <div className="flex-1 space-y-8 w-full">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden ring-1 ring-white/10 group-hover:ring-violet-500/50 transition-all">
                <img
                  src={booking?.salon?.image || "/fallback.png"}
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div>
                <div
                  className={`flex items-center gap-2 mb-2 ${config.color} font-mono text-[10px] tracking-tighter uppercase font-bold`}
                >
                  <StatusIcon size={12} />
                  <span className="bg-white/5 px-2 py-0.5 rounded-full">
                    {config.label}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {booking?.salon?.name}
                </h3>
                <p className="text-zinc-500 text-xs flex items-center gap-1 mt-1 font-medium">
                  {booking?.salon?.address}
                </p>
              </div>
            </div>

            <div className="lg:hidden text-right">
              <p className="text-[10px] font-mono text-zinc-600 uppercase">
                Amount
              </p>
              <p className="text-xl font-black text-white">
                ₹{booking?.totalAmount}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {booking?.services?.map((s, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-xs font-semibold text-zinc-400 group-hover:text-white group-hover:bg-violet-500/10 transition-all"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* SECTION: MIDDLE - SPECS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:px-12 lg:border-x lg:border-white/5">
          <DataPoint
            label="Schedule"
            value={booking?.slot?.date}
            icon={Calendar}
          />
          <DataPoint
            label="Timeframe"
            value={booking?.slot?.startTime}
            icon={Clock}
          />
          <DataPoint
            label="Booking ID"
            value={booking._id.slice(-6).toUpperCase()}
            isMono
          />
        </div>

        {/* SECTION: RIGHT - ACTION/RATING */}
        <div className="w-full lg:w-48 flex flex-col items-center lg:items-end justify-center">
          {isCompleted ? (
            <div className="w-full text-center lg:text-right">
              <p className="text-[10px] font-mono text-zinc-500 uppercase mb-3 tracking-widest">
                Feedback Loop
              </p>
              <div className="flex justify-center lg:justify-end gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={ratingValue > 0}
                    onClick={() =>
                      handleRating(s, booking, refresh, setSubmitting)
                    }
                  >
                    <Star
                      size={20}
                      className={`transition-all duration-300 ${
                        s <= (hover || ratingValue)
                          ? "fill-violet-400 text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]"
                          : "text-zinc-800"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center lg:items-end gap-4 w-full">
              {/* Show Amount for Pending/Accepted */}
              <div className="hidden lg:block text-right">
                <p className="text-[10px] font-mono text-zinc-600 uppercase">
                  Valuation
                </p>
                <p className="text-3xl font-black text-white">
                  ₹{booking?.totalAmount}
                </p>
              </div>

              {/* CANCEL OPTION: Only if not already cancelled or completed */}
              {booking?.status !== "CANCELLED" && (
                <button
                  disabled={submitting}
                  onClick={() =>
                    handleCancel(booking._id, refresh, setSubmitting)
                  }
                  className="w-full lg:w-auto px-4 py-2 rounded-xl border border-rose-900/50 bg-rose-500/5 text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all disabled:opacity-30 disabled:grayscale"
                >
                  {submitting ? "Processing..." : "Cancel Booking"}
                </button>
              )}

              {/* DIRECTIONS: Only show if not cancelled */}
              {booking?.salon?.mapLink && booking?.status !== "CANCELLED" && (
                <button
                  onClick={() => window.open(booking.salon.mapLink, "_blank")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all group"
                >
                  📍 Directions{" "}
                  <ArrowUpRight
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </button>
              )}

              {/* SHOW TERMINATED STATUS IF CANCELLED */}
              {booking?.status === "CANCELLED" && (
                <div className="text-rose-500/50 font-mono text-[10px] uppercase border border-rose-500/20 px-3 py-1 rounded-lg">
                  Voided Transaction
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Logic extracted for cleanliness
const handleRating = async (val, booking, refresh, setSubmitting) => {
  setSubmitting(true);
  try {
    await api.post("/reviews", { bookingId: booking._id, rating: val });
    refresh();
  } catch (err) {
    console.error("Transmission failed", err);
  } finally {
    setSubmitting(false);
  }
};

function DataPoint({ label, value, icon: Icon, isMono = false }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 opacity-40">
        {Icon && <Icon size={10} />}
        <p className="text-[9px] font-mono uppercase tracking-[0.2em]">
          {label}
        </p>
      </div>
      <p
        className={`text-sm font-bold tracking-tight text-zinc-200 ${isMono ? "font-mono text-violet-400/80" : ""}`}
      >
        {value || "---"}
      </p>
    </div>
  );
}
