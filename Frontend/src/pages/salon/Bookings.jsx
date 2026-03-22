import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import from salonThunks instead of bookingThunks
import { fetchSalonBookings, updateSalonBookingStatus } from "../../redux/salon/salonThunks";
import {
  Calendar,
  Clock,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Scissors,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SalonBookings() {
  const dispatch = useDispatch();
  
  // Safely destructure with default empty array to prevent .length errors
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

  // Safe filtering logic with fallback
  const filteredList = filter === "ALL" 
    ? (myBookings || []) 
    : (myBookings || []).filter(b => b?.status === filter);

  if (bookingLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 opacity-30">
        <Loader2 className="animate-spin text-violet-500" size={40} />
        <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Syncing_Schedules...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-violet-500 font-mono text-[10px] tracking-[0.4em] uppercase">
             <Calendar size={14} /> Ops_Daily_Manifest
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Service_ <br/>
            <span className="text-zinc-500 outline-text">Registry</span>
          </h1>
        </div>

        {/* STATUS FILTERS */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start">
          {["ALL", "PENDING", "ACCEPTED", "COMPLETED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] font-mono tracking-widest transition-all ${
                filter === f ? "bg-white text-black font-black" : "text-zinc-500 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* BOOKING FEED */}
      <div className="grid grid-cols-1 gap-4">
        {filteredList.length === 0 ? (
          <div className="py-20 border border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center opacity-20">
            <ShieldAlert size={40} />
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em]">Zero_Entries_Found</p>
          </div>
        ) : (
          filteredList.map((booking) => (
            <div 
              key={booking._id} 
              className="group bg-[#080808] border border-white/5 rounded-[1.5rem] p-6 flex flex-col md:flex-row items-center gap-6 hover:border-violet-500/30 transition-all relative overflow-hidden"
            >
              {/* STATUS GLOW LINE */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                booking.status === 'PENDING' ? 'bg-amber-500' : 
                booking.status === 'ACCEPTED' ? 'bg-sky-500' : 
                booking.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-red-500'
              } opacity-50`} />

              {/* TIME & DATE UNIT */}
              <div className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-2xl p-4 min-w-[120px]">
                <span className="text-[10px] font-mono text-zinc-600 uppercase mb-1">Schedule</span>
                <p className="text-sm font-black text-white">{booking.slotTime}</p>
                <p className="text-[10px] font-mono text-violet-400 mt-1">{booking.date}</p>
              </div>

              {/* CLIENT IDENTITY */}
              <div className="flex-1 space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <UserIcon size={12} className="text-zinc-600" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Subject_Primary</span>
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">
                  {booking.user?.name || "ANONYMOUS_USER"}
                </h3>
                <div className="flex items-center justify-center md:justify-start gap-3">
                   <p className="text-[11px] font-mono text-emerald-500">{booking.user?.phone || "+91 XXXXX XXXXX"}</p>
                   <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                   <p className="text-[11px] font-mono text-zinc-500">{booking.serviceName}</p>
                </div>
              </div>

              {/* PAYLOAD / PRICE */}
              <div className="px-6 border-x border-white/5 hidden lg:block">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1">Revenue_Share</span>
                <p className="text-xl font-black text-white italic">₹{booking.totalAmount - (booking.platformFee || 0)}</p>
                <p className="text-[8px] font-mono text-zinc-700">Gross: ₹{booking.totalAmount}</p>
              </div>

              {/* COMMAND BUTTONS */}
              <div className="flex items-center gap-2">
                {booking.status === "PENDING" && (
                  <button 
                    onClick={() => onStatusChange(booking._id, "ACCEPTED")}
                    className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all"
                  >
                    <CheckCircle2 size={14} /> Accept_Task
                  </button>
                )}
                
                {booking.status === "ACCEPTED" && (
                  <button 
                    onClick={() => onStatusChange(booking._id, "COMPLETED")}
                    className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    <Scissors size={14} /> Complete_Service
                  </button>
                )}

                {(booking.status === "PENDING" || booking.status === "ACCEPTED") && (
                  <button 
                    onClick={() => onStatusChange(booking._id, "CANCELLED")}
                    className="p-3 bg-red-500/5 text-red-500 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <XCircle size={18} />
                  </button>
                )}

                {booking.status === "COMPLETED" && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-[0.2em] font-bold">Protocol_Finalized</span>
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