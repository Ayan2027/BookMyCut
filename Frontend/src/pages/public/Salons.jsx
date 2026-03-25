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
  // Logic to handle missing or zero ratings gracefully
  const avgRating = salon.averageRating || 0;
  const reviewCount = salon.totalReviews || 0;

  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#080808] border border-white/5 rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:border-violet-500/30 hover:bg-white/[0.02] cursor-pointer"
    >
      {/* RECTANGULAR IMAGE LAYER */}
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80 z-10" />
        <img
          src={salon.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop"}
          alt={salon.name}
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* TOP LEFT: VERIFIED BADGE */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black tracking-[0.2em] uppercase text-white/70">Verified_Node</span>
        </div>

        {/* TOP RIGHT: FLOATING RATING BADGE */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-600/20 backdrop-blur-xl border border-violet-500/30 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.1)]">
            <Star size={12} className="text-violet-400 fill-violet-400" />
            <span className="text-sm font-black text-white italic">{avgRating > 0 ? avgRating.toFixed(1) : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* CONTENT LAYER */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-600 text-[9px] font-mono tracking-widest uppercase">
              <MapPin size={10} className="text-violet-500/50" /> {salon.city} — {salon.address}
            </div>
            <h3 className="text-2xl font-black tracking-tighter uppercase italic leading-none group-hover:text-violet-400 transition-colors">
              {salon.name}
            </h3>
          </div>
          <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-all duration-500 shadow-lg">
             <ArrowUpRight size={18} />
          </div>
        </div>

        <p className="text-zinc-500 text-[11px] line-clamp-1 leading-relaxed italic opacity-60">
          {salon.description || "Premium styling and grooming experience tailored to your unique identity."}
        </p>

        {/* METRIC FOOTER: RATING & REVIEWS */}
        <div className="pt-4 flex items-center justify-between border-t border-white/5">
          <div className="flex flex-col gap-1">
             <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-[0.3em]">Protocol_Score</span>
             <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div 
                    key={star} 
                    className={`h-1 w-4 rounded-full transition-colors duration-500 ${star <= Math.round(avgRating) ? "bg-violet-500" : "bg-zinc-900"}`} 
                  />
                ))}
             </div>
          </div>
          
          <div className="text-right">
             <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-[0.3em] block mb-1">Engagements</span>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter italic bg-white/5 px-2 py-0.5 rounded border border-white/5">
               {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
             </span>
          </div>
        </div>
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