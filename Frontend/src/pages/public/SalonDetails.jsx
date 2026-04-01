import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServicesBySalon,
  fetchSlotsBySalon,
  createBooking,
} from "../../redux/booking/bookingThunks";
import { fetchSalonById } from "../../redux/salon/salonThunks";
import { loadRazorpay } from "../../utils/loadRazorpay";
import {
  createOrderAPI,
  verifyPaymentAPI,
} from "../../services/payment.service";
import {
  setService,
  setSlot,
  setDate,
  resetBooking,
} from "../../redux/booking/bookingSlice";
import {
  MapPin,
  Calendar as CalIcon,
  Clock,
  CreditCard,
  Sparkles,
  ChevronRight,
  Loader2,
} from "lucide-react";

import api from "../../services/api";

export default function SalonDetails() {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");

  // Selectors: booking handles UI state, salon handles the fetched data
  const { services, slots, selectedService, selectedSlot, selectedDate } =
    useSelector((s) => s.booking);
  const { salon, loading: salonLoading } = useSelector((s) => s.salon);

  useEffect(() => {
    dispatch(resetBooking());
    dispatch(fetchSalonById(salonId));
    dispatch(fetchServicesBySalon(salonId));
  }, [dispatch, salonId]);

  useEffect(() => {
    if (selectedService && selectedDate) {
      dispatch(fetchSlotsBySalon({ salonId, date: selectedDate }));
    }
  }, [selectedService, selectedDate, dispatch, salonId]);

  const confirmBooking = async () => {
    try {
      setProcessing(true);
      setStatusText("Initializing Transaction...");
      const booking = await dispatch(
        createBooking({
          salonId,
          slotId: selectedSlot._id,
          services: [selectedService._id],
          bookingType: "IN_SALON",
        }),
      ).unwrap();

      setStatusText("Securing Payment Gateway...");
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        alert("Payment SDK failed to load");
        setProcessing(false);
        return;
      }

      const { data } = await createOrderAPI(booking._id);
      const { order } = data;

      setStatusText("Awaiting User Authorization...");
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: salon?.name || "QuickTrim Premium",
        order_id: order.id,
        theme: { color: "#8b5cf6" },
        handler: async function (response) {
          setStatusText("Verifying Ledger...");
          await verifyPaymentAPI(response);
          dispatch(resetBooking());
          navigate("/app/bookings");
        },
        modal: {
          ondismiss: async () => {
            setProcessing(false);
            setStatusText("Transaction Aborted");

            try {
              const res = await api.delete(`/bookings/${booking._id}`);
              console.log("✅ DELETE SUCCESS:", res.data);
            } catch (err) {
              console.log("❌ DELETE ERROR:", err.response?.data);
            }
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setProcessing(false);
      setStatusText("System Error");
    }
  };

  // Helper for map link robustness
  const getMapUrl = () => {
    if (salon?.mapLink && salon.mapLink.startsWith("http"))
      return salon.mapLink;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${salon?.name} ${salon?.address} ${salon?.city}`)}`;
  };

  if (salonLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <Loader2 className="animate-spin text-violet-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 p-6 lg:p-12 selection:bg-violet-500/30">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 1. IMMERSIVE SALON HEADER */}
        {salon && (
          <header className="relative group overflow-hidden bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            {salon.image && (
              <img
                src={salon.image}
                alt={salon.name}
                className="w-64 h-44 object-cover rounded-[2rem] shadow-2xl grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
              />
            )}
            <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-violet-400 font-mono text-[10px] tracking-[0.4em] uppercase">
                <Sparkles size={14} /> Salon
              </div>
              <h1 className="text-5xl font-black tracking-tighter italic uppercase">
                {salon.name}
              </h1>
              <p className="text-zinc-500 flex items-center justify-center md:justify-start gap-2 text-sm">
                <MapPin size={16} className="text-zinc-700" /> {salon.address},{" "}
                {salon.city}
              </p>
              <div className="pt-2">
                <a
                  href={getMapUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest group/btn"
                >
                  Get Directions{" "}
                  <ChevronRight
                    size={14}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            </div>
          </header>
        )}

        {/* 2. THE BOOKING ENGINE (Bento Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Services */}
            <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-xs">
                  01
                </span>
                Selection_Catalog
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((s) => (
                  <button
                    key={s._id}
                    onClick={() => {
                      dispatch(setService(s));
                      dispatch(setSlot(null));
                    }}
                    className={`relative p-6 rounded-2xl border text-left transition-all duration-300 ${
                      selectedService?._id === s._id
                        ? "bg-violet-600 border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                        : "bg-white/5 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <p
                      className={`text-lg font-bold tracking-tight ${selectedService?._id === s._id ? "text-white" : "text-zinc-300"}`}
                    >
                      {s.name}
                    </p>
                    <p
                      className={
                        selectedService?._id === s._id
                          ? "text-violet-200"
                          : "text-zinc-500"
                      }
                    >
                      ₹{s.price}
                    </p>
                    {selectedService?._id === s._id && (
                      <div className="absolute top-4 right-4 h-2 w-2 bg-white rounded-full animate-ping" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2 & 3: Temporal Config */}
            {selectedService && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-3 italic">
                    <CalIcon size={18} /> Date_Index
                  </h2>
                  <div className="relative group">
                    <input
                      type="date"
                      onClick={(e) => e.target.showPicker()}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-violet-400 focus:outline-none focus:border-violet-500 transition-all font-mono cursor-pointer hover:bg-white/[0.02]"
                      onChange={(e) => {
                        dispatch(setDate(e.target.value));
                        dispatch(setSlot(null));
                      }}
                    />
                    {!selectedDate && (
                      <div className="absolute inset-0 flex items-center px-4 pointer-events-none text-zinc-600 font-mono text-xs uppercase tracking-tighter">
                        Click to set_date...
                      </div>
                    )}
                  </div>
                </section>

                {selectedDate && (
                  <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-3 italic">
                      <Clock size={18} /> Time_Matrix
                    </h2>
                    {slots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot._id}
                            onClick={() => dispatch(setSlot(slot))}
                            className={`py-2 rounded-lg border font-mono text-xs transition-all ${
                              selectedSlot?._id === slot._id
                                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                : "bg-white/5 border-white/5 hover:border-white/10 text-zinc-500"
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-zinc-600 font-mono text-[10px] uppercase italic">
                        Zero_Slots_Found
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}
          </div>

          {/* 3. SYNOPSIS & CHECKOUT HUD */}
          <aside className="relative">
            <div className="sticky top-32 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[2.5rem] p-8 space-y-8 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard size={100} />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                Summary
              </h2>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Service</span>
                  <span className="text-zinc-200">
                    {selectedService?.name || "--"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Schedule</span>
                  <span className="text-zinc-200">
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "--"}
                    {selectedSlot ? ` @ ${selectedSlot.startTime}` : ""}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                    Total_Payload
                  </span>
                  <span className="text-3xl font-light tracking-tighter text-white">
                    ₹{selectedService?.price || 0}
                  </span>
                </div>
              </div>

              <button
                disabled={
                  processing ||
                  !selectedService ||
                  !selectedDate ||
                  !selectedSlot
                }
                onClick={confirmBooking}
                className="group relative w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl overflow-hidden transition-all active:scale-95 disabled:opacity-20"
              >
                <div className="absolute inset-0 bg-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                  {processing ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Authorize Payment"
                  )}
                </span>
              </button>

              {statusText && (
                <div className="flex items-center justify-center gap-2 py-2 px-4 bg-white/5 rounded-full">
                  <div className="w-1 h-1 rounded-full bg-violet-500 animate-ping" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    {statusText}
                  </span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
