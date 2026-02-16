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
    <div className="min-h-screen bg-[#030303] text-zinc-100 p-6 lg:p-12 space-y-12 selection:bg-violet-500/30">
      
      {/* 1. DISCOVERY HEADER */}
      <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-violet-500 animate-pulse" size={18} />
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-zinc-500">Curated Studios</span>
          </div>
          <h1 className="text-7xl font-black italic tracking-tighter bg-gradient-to-b from-white via-white to-zinc-800 bg-clip-text text-transparent">
            EXPLORE
          </h1>
          <p className="max-w-md text-zinc-500 text-sm leading-relaxed italic">
            Connect with the elite of grooming. High-fidelity service providers calibrated for your specific aesthetic requirements.
          </p>
        </div>

        {/* ADVANCED SEARCH/FILTER BAR */}
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-2 backdrop-blur-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              className="bg-transparent border-none pl-12 pr-4 py-2 text-sm focus:outline-none w-48 lg:w-64" 
              placeholder="Search by city or style..." 
            />
          </div>
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <Filter size={18} className="text-violet-400" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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

// ADVANCED COMPONENT: Immersive Salon Card
function SalonCard({ salon, onClick }) {
  return (
    <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-violet-500/40 hover:-translate-y-2 shadow-2xl">
      
      {/* IMAGE LAYER WITH OVERLAYS */}
      <div className="relative h-72 overflow-hidden cursor-pointer" onClick={onClick}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20 z-10" />
        <img
          src={salon.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop"}
          alt={salon.name}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
        />
        
        {/* TOP BADGE */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="text-[10px] font-black tracking-widest uppercase">Elite Partner</span>
        </div>

        {/* FLOATING ACTION BUTTON */}
        <button className="absolute bottom-6 right-6 z-20 h-12 w-12 bg-white text-black rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <ArrowUpRight size={24} />
        </button>
      </div>

      {/* CONTENT LAYER */}
      <div className="p-8 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-400 text-[10px] font-mono tracking-[0.3em] uppercase mb-1">
            <MapPin size={12} /> {salon.city}
          </div>
          <h3 className="text-2xl font-bold tracking-tighter uppercase italic group-hover:text-white transition-colors cursor-pointer" onClick={onClick}>
            {salon.name}
          </h3>
        </div>

        <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed font-medium italic opacity-80">
          {salon.description || "Premium styling and grooming experience tailored to your unique identity."}
        </p>

        <div className="pt-4 flex flex-col gap-3">
          <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              Available_Now
            </span>
            <button 
              onClick={onClick}
              className="text-xs font-black uppercase tracking-tighter text-white hover:text-violet-400 transition-colors"
            >
              Book Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-[450px] bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-40 text-center space-y-4 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
      <p className="text-zinc-700 italic tracking-[0.5em] uppercase text-sm">No Active Nodes Found</p>
      <button className="text-xs text-violet-500 hover:text-white transition-colors uppercase font-mono tracking-widest">Refresh_Data_Stream</button>
    </div>
  );
}