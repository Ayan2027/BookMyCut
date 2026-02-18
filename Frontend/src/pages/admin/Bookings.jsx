import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBookings, adminUpdateBookingStatus } from "../../redux/admin/adminThunks";
import {
  Eye,
  XCircle,
  CheckCircle,
  User as UserIcon,
  Activity,
  Loader2,
  Hash,
  Clock,
  IndianRupee,
  ShieldCheck,
  CreditCard
} from "lucide-react";

export default function AdminBookings() {
  const dispatch = useDispatch();
  const { bookings, bookingLoading } = useSelector((s) => s.admin);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleStatusUpdate = (id, status) => {
    dispatch(adminUpdateBookingStatus({ id, status }));
  };

  if (bookingLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 opacity-20">
        <Loader2 className="animate-spin text-violet-500" size={40} />
        <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Deciphering_Registry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 selection:bg-violet-500/30">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          {/* <div className="flex items-center gap-2 text-violet-500 font-mono text-[10px] tracking-[0.4em] uppercase">
             <Activity size={14} /> Global_Transaction_Log
          </div> */}
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            BOOKING_ <br/>
            <span className="text-zinc-500 outline-text">LOGS</span>
          </h1>
        </div>
      </header>

      <div className="bg-[#080808] border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Protocol_Identity</th>
                <th className="p-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Sector_Node</th>
                <th className="p-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Registry_Trace</th>
                <th className="p-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Payload</th>
                <th className="p-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest text-center">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {bookings.map((b) => (
                <tr key={b._id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
                        <UserIcon size={14} className="text-zinc-600" />
                      </div>
                      <div className="max-w-[150px]">
                        <p className="text-[11px] font-bold text-zinc-200 truncate uppercase tracking-tighter">
                          {b.user?.name || b.user?.email?.split('@')[0]}
                        </p>
                        <p className="text-[9px] text-zinc-600 truncate">{b.user?.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6 text-[11px] font-black italic uppercase text-violet-400">
                    {b.salon?.name || "NULL_SECTOR"}
                  </td>

                  {/* TRANSACTION TRACE COLUMN */}
                  <td className="p-6">
                    {b.transaction ? (
                      <div className="space-y-1">
                        <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                          <CreditCard size={10} /> {b.transaction.razorpayPaymentId?.slice(-12)}
                        </p>
                        <p className="text-[8px] text-zinc-600">ORD_{b.transaction.razorpayOrderId?.slice(-8)}</p>
                      </div>
                    ) : (
                      <span className="text-[9px] text-zinc-800 italic">OFFLINE_SETTLEMENT</span>
                    )}
                  </td>

                  <td className="p-6">
                    <p className="text-xs font-bold text-white tracking-tighter">₹{b.totalAmount}</p>
                    <p className="text-[8px] text-zinc-600 italic">Fee: ₹{b.platformFee}</p>
                  </td>

                  <td className="p-6">
                    <StatusIndicator status={b.status} />
                  </td>

                  <td className="p-6">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setSelected(b)} className="p-2 bg-white/5 border border-white/5 rounded-lg text-zinc-500 hover:text-white transition-all">
                        <Eye size={14} />
                      </button>
                      {b.status === "PENDING" && (
                        <>
                          <button onClick={() => handleStatusUpdate(b._id, "COMPLETED")} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black rounded-lg transition-all">
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => handleStatusUpdate(b._id, "CANCELLED")} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black rounded-lg transition-all">
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <DetailOverlay booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function DetailOverlay({ booking, onClose }) {
  const t = booking.transaction;
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 font-mono">
      <div className="bg-[#080808] border border-white/10 rounded-[2rem] p-8 w-full max-w-xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        <header className="mb-8 flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">Registry_Trace</h2>
            <p className="text-[9px] text-zinc-600 uppercase tracking-widest">ID: {booking._id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-500/10 rounded-xl text-zinc-500 hover:text-red-500 transition-colors">
            <XCircle size={24} />
          </button>
        </header>

        <div className="space-y-6">
          {/* LEDGER SECTION */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
             <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold border-b border-white/5 pb-2">
                <span>Description</span>
                <span>Amount</span>
             </div>
             <div className="flex justify-between text-xs">
                <span className="text-zinc-400">User_Transaction_Total</span>
                <span className="text-white font-bold">₹{booking.totalAmount}</span>
             </div>
             <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Platform_Commission_Fee</span>
                <span className="text-emerald-500 font-bold">+ ₹{booking.platformFee}</span>
             </div>
             <div className="flex justify-between text-sm border-t border-white/5 pt-3">
                <span className="text-zinc-400 italic font-black uppercase">Salon_Net_Payout</span>
                <span className="text-violet-400 font-black tracking-tighter text-lg">
                  ₹{t?.salonEarning || (booking.totalAmount - booking.platformFee)}
                </span>
             </div>
          </div>

          {/* GATEWAY METADATA */}
          <div className="grid grid-cols-2 gap-4 text-[10px]">
             <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                <p className="text-zinc-600 uppercase mb-1 font-bold">RZP_Order_ID</p>
                <p className="text-zinc-300 truncate">{t?.razorpayOrderId || "N/A"}</p>
             </div>
             <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                <p className="text-zinc-600 uppercase mb-1 font-bold">RZP_Payment_ID</p>
                <p className="text-zinc-300 truncate">{t?.razorpayPaymentId || "N/A"}</p>
             </div>
          </div>
        </div>

        <button onClick={onClose} className="mt-8 w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-violet-600 hover:text-white transition-all">
          Authorize_Close
        </button>
      </div>
    </div>
  );
}

function StatusIndicator({ status }) {
  const colors = {
    PENDING: "text-amber-500 bg-amber-500/5 border-amber-500/20",
    COMPLETED: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20",
    CANCELLED: "text-red-500 bg-red-500/5 border-red-500/20",
  };
  return (
    <span className={`px-2 py-1 rounded border text-[8px] font-black uppercase tracking-widest ${colors[status] || "text-zinc-500 border-zinc-500"}`}>
      {status}
    </span>
  );
}