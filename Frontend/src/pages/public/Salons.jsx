import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalons } from "../../redux/salon/salonThunks";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowUpRight, Star, Filter, Search, Sparkles } from "lucide-react";

export default function Salons() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { salons, loading } = useSelector((s) => s.salon);

  useEffect(() => {
    dispatch(fetchSalons());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 p-6 lg:p-12 selection:bg-violet-500/30">
      
      {/* 1. DISCOVERY HEADER */}
      <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-7xl mx-auto mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-violet-500 animate-pulse" size={16} />
            <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-zinc-500">Curated Studios</span>
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter bg-gradient-to-b from-white via-white to-zinc-800 bg-clip-text text-transparent uppercase">
            Explore
          </h1>
          <p className="max-w-md text-zinc-500 text-xs leading-relaxed italic opacity-70">
            Calibration of personal aesthetic through high-fidelity grooming protocols.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-2 backdrop-blur-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              className="bg-transparent border-none pl-10 pr-4 py-2 text-xs focus:outline-none w-48 lg:w-64 font-mono uppercase tracking-widest placeholder:text-zinc-800" 
              placeholder="Locate_Node..." 
            />
          </div>
          <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <Filter size={16} className="text-violet-400" />
          </button>
        </div>
      </header>

      {/* 2. MAIN GRID */}
      <main className="max-w-7xl mx-auto">
        {loading ? (
          <LoadingGrid />
        ) : !salons?.length ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {salons.map((s) => (
              <SalonCard 
                key={s._id} 
                salon={s} 
                onClick={() => navigate(`/app/salons/${s._id}`)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SalonCard({ salon, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#080808] border border-white/5 rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:border-violet-500/30 hover:bg-white/[0.02] cursor-pointer"
    >
      {/* RECTANGULAR IMAGE LAYER (16:9 Aspect Ratio) */}
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80 z-10" />
        <img
          src={salon.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop"}
          alt={salon.name}
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* SMALLER BADGE */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
          <Star size={10} className="text-violet-400 fill-violet-400" />
          <span className="text-[8px] font-black tracking-[0.2em] uppercase text-white">Verified</span>
        </div>
      </div>

      {/* TIGHTER CONTENT LAYER */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-600 text-[9px] font-mono tracking-widest uppercase">
              <MapPin size={10} /> {salon.city}
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none group-hover:text-violet-400 transition-colors">
              {salon.name}
            </h3>
          </div>
          <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
             <ArrowUpRight size={18} />
          </div>
        </div>

        <p className="text-zinc-500 text-[11px] line-clamp-1 leading-relaxed italic opacity-60">
          {salon.description || "Premium styling and grooming experience tailored to your unique identity."}
        </p>

        {/* <div className="pt-2 flex items-center justify-between border-t border-white/5">
           <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Min_Rate</span>
           <span className="text-sm font-bold text-zinc-300 tracking-tight italic">₹80+</span>
        </div> */}
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="aspect-video bg-white/[0.02] border border-white/5 rounded-[1.5rem] animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center border border-dashed border-white/10 rounded-[2rem] opacity-40">
      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Zero_Nodes_Detected</p>
    </div>
  );
}