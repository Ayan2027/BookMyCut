import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSalonBookings,
  updateSalonBookingStatus,
} from "../../redux/salon/salonThunks";
import {
  Calendar,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Scissors,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function SalonBookings() {
  const dispatch = useDispatch();

  const { myBookings = [], bookingLoading } = useSelector((s) => s.salon);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    dispatch(fetchSalonBookings());
  }, [dispatch]);

  const onStatusChange = async (id, status) => {
    const res = await dispatch(updateSalonBookingStatus({ id, status }));
    if (updateSalonBookingStatus.fulfilled.match(res)) {
      toast.success(`Protocol_${status}: Updated`);
    } else {
      toast.error("Override failed");
    }
  };
  const onCancelBooking = async (id) => {
    try {
      const { data } = await api.patch(`/bookings/${id}/cancel`, {
        cancelledBy: "SALON",
      });

      toast.success(`Cancelled + Refund ₹${data.refundAmount}`);

      // refresh bookings
      dispatch(fetchSalonBookings());
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed");
    }
  };

  const filteredList =
    filter === "ALL"
      ? myBookings
      : myBookings.filter((b) => b?.status === filter);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (bookingLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 opacity-30">
        <Loader2 className="animate-spin text-violet-500" size={40} />
        <span className="text-[10px] font-mono uppercase tracking-[0.4em]">
          Syncing_Schedules...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700 px-4 md:px-0">
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-violet-500 font-mono text-[10px] tracking-[0.4em] uppercase">
            <Calendar size={14} /> Ops_Daily_Manifest
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
            Service_ <br />
            <span className="text-zinc-500 outline-text">Registry</span>
          </h1>
        </div>

        {/* FILTERS */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start max-w-full overflow-x-auto no-scrollbar">
          {["ALL", "PENDING", "CONFIRMED", "ACCEPTED", "COMPLETED", "CANCELLED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] font-mono tracking-widest transition-all whitespace-nowrap ${
                filter === f
                  ? "bg-white text-black font-black"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* BOOKINGS */}
      <div className="grid grid-cols-1 gap-4">
        {filteredList.length === 0 ? (
          <div className="py-20 border border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center opacity-20">
            <ShieldAlert size={40} />
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em]">
              Zero_Entries_Found
            </p>
          </div>
        ) : (
          filteredList.map((booking) => (
            <div
              key={booking._id}
              className={`group border rounded-[1.5rem] p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 transition-all relative overflow-hidden ${
                booking.status === "CANCELLED" 
                  ? "bg-red-500/[0.02] border-red-500/20" 
                  : booking.status === "COMPLETED" 
                  ? "bg-emerald-500/[0.02] border-emerald-500/20" 
                  : "bg-[#080808] border-white/5 hover:border-violet-500/30"
              }`}
            >
              {/* STATUS LINE */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  booking.status === "PENDING" || booking.status === "CONFIRMED"
                    ? "bg-amber-500"
                    : booking.status === "ACCEPTED"
                      ? "bg-sky-500"
                      : booking.status === "COMPLETED"
                        ? "bg-emerald-500"
                        : "bg-red-500"
                } opacity-50`}
              />

              {/* SLOT INFO */}
              <div className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-2xl p-4 w-full md:w-[140px]">
                <span className="text-[10px] font-mono text-zinc-600 uppercase mb-1">
                  Schedule
                </span>
                {booking.slot ? (
                  <>
                    <p className="text-sm font-black text-white">
                      {booking.slot.startTime} - {booking.slot.endTime}
                    </p>
                    <p className="text-[10px] font-mono text-violet-400 mt-1">
                      {formatDate(booking.slot.date)}
                    </p>
                  </>
                ) : (
                  <p className="text-red-400 text-xs">Slot Missing</p>
                )}
              </div>

              {/* USER */}
              <div className="flex-1 space-y-1 text-center md:text-left w-full">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <UserIcon size={12} className="text-zinc-600" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    Subject_Primary
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">
                  {booking.user?.name ||
                    booking.user?.email?.split("@")[0] ||
                    "ANONYMOUS"}
                </h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                  <p className="text-[11px] font-mono text-emerald-500">
                    {booking.user?.phone || "NO_CONTACT"}
                  </p>
                  <div className="hidden md:block h-1 w-1 bg-zinc-800 rounded-full" />
                  <p className="text-[11px] font-mono text-zinc-500 uppercase">
                    {booking.services?.[0]?.name || "CUSTOM_SERVICE"}
                    {booking.services?.length > 1 &&
                      ` (+${booking.services.length - 1})`}
                  </p>
                </div>
              </div>

              {/* REVENUE SHARE */}
              <div className="w-full md:w-auto px-6 py-4 md:py-0 border-y md:border-y-0 md:border-x border-white/5 flex flex-col items-center md:items-start">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1">
                  Revenue_Share
                </span>
                <p className={`text-xl font-black italic ${booking.status === "CANCELLED" ? "text-red-500/50 line-through" : "text-white"}`}>
                  ₹
                  {booking.subtotal ||
                    booking.totalAmount - (booking.platformFee || 0)}
                </p>
                <p className="text-[8px] font-mono text-zinc-700">
                  Gross: ₹{booking.totalAmount}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
                {(booking.status === "PENDING" ||
                  booking.status === "CONFIRMED") && (
                  <button
                    onClick={() => onStatusChange(booking._id, "ACCEPTED")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all"
                  >
                    <CheckCircle2 size={14} /> Accept_Task
                  </button>
                )}

                {booking.status === "ACCEPTED" && (
                  <button
                    onClick={() => {
                      if (window.confirm("Confirm Completion: Has the customer received the service?")) {
                        onStatusChange(booking._id, "COMPLETED")
                      }
                    }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    <Scissors size={14} /> Complete_Service
                  </button>
                )}

                {(booking.status === "PENDING" ||
                  booking.status === "CONFIRMED" ||
                  booking.status === "ACCEPTED") && (
                  <button
                    onClick={() => {
                      const confirmCancel = window.confirm(
                        "⚠️ Are you sure you want to cancel this booking?\n\nFull refund will be issued to the customer.",
                      );

                      if (confirmCancel) {
                        onCancelBooking(booking._id);
                      }
                    }}
                    className="p-3 bg-red-500/5 text-red-500 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    title="Cancel Booking"
                  >
                    <XCircle size={18} />
                  </button>
                )}

                {/* GREENISH FOR COMPLETED */}
                {booking.status === "COMPLETED" && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-[0.2em] font-bold">
                      COMPLETED
                    </span>
                  </div>
                )}

                {/* RED WARNING FOR CANCELLED */}
                {booking.status === "CANCELLED" && (
                   <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                   <ShieldAlert size={14} className="text-red-500" />
                   <span className="text-[9px] font-mono text-red-400 uppercase tracking-[0.2em] font-bold">
                     CANCELLED
                   </span>
                 </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}