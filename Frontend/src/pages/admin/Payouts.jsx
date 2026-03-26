import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayouts, payoutAction } from "../../redux/admin/adminThunks";
import { CheckCircle, Wallet, Calendar, ArrowRight, CreditCard } from "lucide-react";

export default function PayoutsPage() {
  const dispatch = useDispatch();
  const { payouts = [], payoutLoading } = useSelector((s) => s.admin);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amounts, setAmounts] = useState({});

  useEffect(() => {
    dispatch(fetchPayouts(date));
  }, [dispatch, date]);

  const handlePay = (salonId) => {
    const amount = Number(amounts[salonId] || 0);
    if (amount <= 0) return alert("Please enter a valid amount");

    dispatch(
      payoutAction({
        salonId,
        date,
        amount,
        note: "Manual payout",
      })
    );
    // Clear input after dispatch
    setAmounts({ ...amounts, [salonId]: "" });
  };

  return (
    <div className="p-6 min-h-screen text-slate-100 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Wallet className="text-emerald-400" size={32} />
            Payouts Management
          </h1>
          <p className="text-slate-400 mt-1">Manage and track salon commissions and settlements.</p>
        </div>

        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-black/40 border border-white/10 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all cursor-pointer"
          />
        </div>
      </div>

      {/* MAIN TABLE CARD */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Salon Details</th>
                <th className="px-6 py-4 font-semibold text-center">Earning</th>
                <th className="px-6 py-4 font-semibold text-center">Paid</th>
                <th className="px-6 py-4 font-semibold text-center">Remaining Balance</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {payouts.map((p) => {
                const isSettled = p.balance <= 0;

                return (
                  <tr key={p.salonId} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{p.salonName}</div>
                      <div className="text-xs text-slate-500">ID: {p.salonId.slice(-6)}</div>
                    </td>

                    <td className="px-6 py-4 text-center font-mono">₹{p.earning.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-emerald-400 font-mono">₹{p.paidAmount.toLocaleString()}</td>
                    
                    <td className={`px-6 py-4 text-center font-bold font-mono ${isSettled ? 'text-slate-500' : 'text-orange-400'}`}>
                      ₹{p.balance.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        isSettled 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {isSettled ? "Completed" : p.payoutStatus || "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {isSettled ? (
                          <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-lg border border-emerald-500/20">
                            <CheckCircle size={16} />
                            <span className="text-xs font-bold">Fully Paid</span>
                          </div>
                        ) : (
                          <>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                              <input
                                type="number"
                                placeholder="0.00"
                                value={amounts[p.salonId] || ""}
                                onChange={(e) =>
                                  setAmounts({
                                    ...amounts,
                                    [p.salonId]: e.target.value,
                                  })
                                }
                                className="w-28 bg-black/60 border border-white/10 pl-5 pr-2 py-2 rounded-lg text-sm focus:border-emerald-500 outline-none transition-all"
                              />
                            </div>
                            <button
                              onClick={() => handlePay(p.salonId)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-all active:scale-95 flex items-center gap-2 px-4 group"
                            >
                              <span className="text-xs font-bold uppercase">Pay</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {payoutLoading && (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm animate-pulse">Fetching latest payout data...</p>
          </div>
        )}

        {!payoutLoading && payouts.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
             <CreditCard size={48} className="text-slate-700 mb-4" />
             <p className="text-slate-500">No payout records found for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
}