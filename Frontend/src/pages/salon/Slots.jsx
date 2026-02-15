import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Cpu, Trash2, Clock, Zap, Layers, Plus } from "lucide-react";
import { fetchMySlots, generateSlots, deleteSlot } from "../../redux/slot/slotThunks";

export default function Slots() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.slot);
  const [date, setDate] = useState("");

  useEffect(() => {
    dispatch(fetchMySlots());
  }, [dispatch]);

  const submit = () => {
    if (!date) return;
    dispatch(generateSlots({ date })).then(() => dispatch(fetchMySlots()));
  };

  const grouped = list.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 p-6 lg:p-12 space-y-12 selection:bg-sky-500/30">
      
      {/* 1. KINETIC HEADER */}
      <header className="relative group max-w-4xl">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-500 via-transparent to-transparent opacity-50" />
        <h2 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-zinc-400 to-zinc-800 bg-clip-text text-transparent italic">
          TIME_STREAMS
        </h2>
        <p className="text-zinc-500 font-mono text-[10px] tracking-[0.5em] mt-2 uppercase flex items-center gap-2">
          <Cpu size={12} className="animate-spin-slow" /> Temporal Slot Management System
        </p>
      </header>

      {/* 2. NEURAL GENERATOR (Glassmorphic Controller) */}
      <section className="relative">
        <div className="absolute inset-0 bg-sky-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Layers size={18} className="text-sky-400" />
              Batch Initialization
            </h3>
            <p className="text-zinc-500 text-sm italic">Define target date for autonomous slot generation.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-sky-500/20 blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <input
                type="date"
                className="relative w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sky-400 focus:outline-none focus:border-sky-500 transition-all font-mono"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <button
              onClick={submit}
              className="group relative px-8 py-4 bg-white text-black font-black uppercase tracking-tighter rounded-2xl overflow-hidden hover:scale-105 active:scale-95 transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap size={18} fill="currentColor" />
                Generate 09:00 - 20:00
              </span>
              <div className="absolute inset-0 bg-sky-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. GROUPED TIMELINE (IRCTC Elite Style) */}
      <section className="space-y-12">
        {loading ? (
          <div className="font-mono text-zinc-600 animate-pulse tracking-widest text-center py-20 uppercase">
            Fetching Temporal Data...
          </div>
        ) : (
          Object.keys(grouped).sort().map((date) => (
            <div key={date} className="relative pl-8 md:pl-0">
              {/* Date Divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-sky-500/10 border border-sky-500/20 px-6 py-2 rounded-full">
                  <h4 className="text-sky-400 font-mono font-bold tracking-widest uppercase text-sm">
                    {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
                  </h4>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-sky-500/30 to-transparent" />
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {grouped[date].map((slot) => (
                  <SlotCard
                    key={slot._id}
                    slot={slot}
                    onDelete={() => dispatch(deleteSlot(slot._id))}
                  />
                ))}
              </div>
            </div>
          ))
        )}

        {!loading && list.length === 0 && (
          <div className="py-32 text-center border border-white/5 rounded-[3rem] bg-white/[0.01]">
            <p className="text-zinc-700 italic font-light tracking-widest uppercase">No Active Time Streams Detected</p>
          </div>
        )}
      </section>
    </div>
  );
}

function SlotCard({ slot, onDelete }) {
  return (
    <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 hover:border-sky-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-sky-500/5 blur-xl group-hover:bg-sky-500/20 transition-all" />
      
      <div className="flex flex-col items-center gap-1">
        <Clock size={14} className="text-zinc-800 group-hover:text-sky-400 transition-colors mb-2" />
        <p className="text-xl font-bold tracking-tight text-zinc-200">
          {slot.startTime}
        </p>
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">
          thru {slot.endTime}
        </p>
      </div>

      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-1 text-zinc-900 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"
      >
        <Trash2 size={14} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
    </div>
  );
}