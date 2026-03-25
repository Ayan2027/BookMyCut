import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  XCircle,
  CheckCircle2,
  Timer,
  Package,
  Star,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { fetchAllBookings } from "../../redux/booking/bookingThunks";
import api from "../../services/api";

export default function UserBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((s) => s.booking);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* HEADER */}
        <header className="relative p-12 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-violet-500" />
            <span className="text-violet-500 font-mono text-[10px] tracking-[0.5em] uppercase">
              Admin Panel
            </span>
          </div>
          <h2 className="text-6xl font-black italic text-white uppercase">
            All Bookings
          </h2>
        </header>

        {/* CONTENT */}
        {loading ? (
          <div className="py-24 text-center border border-white/5 rounded-[3rem] bg-white/[0.01] animate-pulse">
            Loading...
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings?.map((b) => (
              <BookingCard
                key={b._id}
                booking={b}
                refresh={() => dispatch(fetchAllBookings())}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, refresh }) {
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = statusConfig[booking.status] || statusConfig.PENDING;
  const isCompleted = booking.status === "COMPLETED";
  const hasReviewed = booking.rating > 0;

  const handleRating = async (val) => {
    if (isSubmitting || hasReviewed) return;
    setIsSubmitting(true);
    try {
      await api.post("/reviews", { bookingId: booking._id, rating: val });
      await refresh();
    } catch (err) {
      console.error("Rating failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await api.patch(`/bookings/${booking._id}/status`, { status });
      refresh();
    } catch (err) {
      console.error("Status update failed");
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 space-y-6">

      {/* STATUS + ID */}
      <div className="flex justify-between items-center">
        <div className={`px-4 py-1 rounded-full text-xs flex items-center gap-2 ${config.bg} ${config.border} ${config.color}`}>
          {config.icon} {booking.status}
        </div>
        <span className="text-xs text-zinc-600">ID: {booking._id.slice(-6)}</span>
      </div>

      {/* SERVICES */}
      <h3 className="text-xl font-bold text-white">
        {booking.services?.map(s => `${s.name} (₹${s.price})`).join(" + ")}
      </h3>

      {/* MAIN DATA */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <DataPoint label="Salon" value={booking.salon?.name} />
        <DataPoint label="User" value={booking.user?.email} />
        <DataPoint label="Type" value={booking.bookingType} />

        <DataPoint label="Date" value={booking.slot?.date} />
        <DataPoint label="Time" value={booking.slot?.startTime} />

        <DataPoint label="Subtotal" value={`₹${booking.subtotal}`} />
        <DataPoint label="Platform Fee" value={`₹${booking.platformFee}`} />
        <DataPoint label="Total" value={`₹${booking.totalAmount}`} color="text-violet-400" />

        <DataPoint
          label="Created"
          value={new Date(booking.createdAt).toLocaleString()}
        />
      </div>

      {/* PAYMENT INFO */}
      {booking.transaction && (
        <div className="p-4 rounded-xl bg-black/30 border border-white/5">
          <p className="text-xs text-zinc-500 mb-2">Payment Info</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataPoint label="Order ID" value={booking.transaction?.razorpayOrderId} />
            <DataPoint label="Payment ID" value={booking.transaction?.razorpayPaymentId || "Pending"} />
          </div>
        </div>
      )}

      {/* STATUS CONTROL */}
      <div>
        <p className="text-xs text-zinc-500 mb-2">Update Status</p>
        <select
          value={booking.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-black border border-white/10 text-sm p-2 rounded-lg"
        >
          <option value="PENDING">PENDING</option>
          <option value="ACCEPTED">ACCEPTED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* RATING */}
      {isCompleted && (
        <div>
          {hasReviewed ? (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={s <= booking.rating ? "text-violet-500 fill-violet-500" : "text-zinc-700"}
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => handleRating(s)}>
                  <Star size={18} className="hover:text-white" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DataPoint({ label, value, color = "text-zinc-300" }) {
  return (
    <div>
      <p className="text-[10px] text-zinc-500">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>
        {value || "N/A"}
      </p>
    </div>
  );
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    icon: <Timer size={14} />,
  },
  ACCEPTED: {
    label: "Accepted",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    icon: <CheckCircle2 size={14} />,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
    icon: <Package size={14} />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: <XCircle size={14} />,
  },
};