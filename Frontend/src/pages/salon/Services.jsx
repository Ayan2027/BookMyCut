import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Scissors, Plus, Trash2, Clock, IndianRupee, Sparkles, Home } from "lucide-react";
import { fetchMyServices, createService, deleteService } from "../../redux/service/serviceThunks";

export default function Services() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.service);

  const [form, setForm] = useState({
    name: "",
    price: "",
    durationMinutes: "",
    isHomeService: false
  });

  useEffect(() => {
    dispatch(fetchMyServices());
  }, [dispatch]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name || !form.price || !form.durationMinutes) return;
    dispatch(createService({
      ...form,
      price: Number(form.price),
      durationMinutes: Number(form.durationMinutes)
    }));
    setForm({ name: "", price: "", durationMinutes: "", isHomeService: false });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 lg:p-12 space-y-12">
      
      {/* 1. LAYERED HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-white via-white to-zinc-600 bg-clip-text text-transparent italic">
            CATALOGUE
          </h2>
          <p className="text-zinc-500 font-mono text-xs tracking-[0.3em] mt-2 uppercase">
            Service Definition & Pricing Module
          </p>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent mb-4 hidden md:block ml-8" />
      </header>

      {/* 2. ADVANCED INPUT FORM (Glassmorphic) */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 mb-8 flex items-center gap-2 uppercase">
            <Sparkles size={16} className="text-violet-400" />
            Initialize New Offering
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <EliteInput 
              placeholder="Service Identity (e.g. Skin Fade)" 
              value={form.name} 
              onChange={(e) => update("name", e.target.value)} 
            />
            <EliteInput 
              placeholder="Valuation (₹)" 
              value={form.price} 
              type="number"
              onChange={(e) => update("price", e.target.value)} 
            />
            <EliteInput 
              placeholder="Time Delta (Min)" 
              value={form.durationMinutes} 
              type="number"
              onChange={(e) => update("durationMinutes", e.target.value)} 
            />
            
            <button
              onClick={submit}
              className="h-14 bg-white text-black font-black uppercase tracking-tighter rounded-xl hover:bg-violet-400 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Plus size={20} strokeWidth={3} />
              Commit Service
            </button>
          </div>
        </div>
      </section>

      {/* 3. SERVICE GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium tracking-tight">Current Fleet</h3>
          <span className="text-xs font-mono text-zinc-600">{list.length} Services Active</span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center border border-white/5 rounded-[2rem] animate-pulse bg-white/5 text-zinc-500 font-mono uppercase tracking-widest">
            Fetching Data Streams...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((s) => (
              <ServiceCard
                key={s._id}
                service={s}
                onDelete={() => dispatch(deleteService(s._id))}
              />
            ))}
            {list.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] text-zinc-600 italic">
                No active services found in database.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// ADVANCED COMPONENT: Elite Input Field
function EliteInput({ placeholder, value, onChange, type = "text" }) {
  return (
    <div className="relative group">
      <input
        type={type}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-white/[0.08] transition-all"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

// ADVANCED COMPONENT: Service Card
function ServiceCard({ service, onDelete }) {
  return (
    <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 hover:border-violet-500/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-start mb-6">
        <div className="h-12 w-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
          <Scissors size={22} />
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-zinc-800 hover:text-red-500 transition-colors"
          title="Archive Service"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <h4 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-white transition-colors uppercase italic">
        {service.name}
      </h4>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-zinc-400">
          <IndianRupee size={16} className="text-zinc-700" />
          <span className="text-lg font-mono text-zinc-200">₹{service.price}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <Clock size={16} className="text-zinc-700" />
          <span className="text-sm tracking-wide">{service.durationMinutes} Minutes</span>
        </div>
      </div>

      {/* Subtle indicator for Home Service */}
      {service.isHomeService && (
        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-violet-400 bg-violet-400/5 w-fit px-3 py-1 rounded-full border border-violet-400/20 uppercase tracking-widest">
          <Home size={10} />
          Doorstep Available
        </div>
      )}
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-violet-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}