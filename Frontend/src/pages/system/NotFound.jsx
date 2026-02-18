import { useNavigate } from "react-router-dom";
import { ChevronLeft, Home, Scissors } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex items-center justify-center p-6 selection:bg-violet-500/30">
      
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* LOGO INDICATOR */}
        <div className="flex justify-center">
            <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <Scissors size={24} className="text-zinc-500" />
            </div>
        </div>

        {/* ERROR MESSAGE */}
        <div className="space-y-2">
          <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-none">
            404_
          </h1>
          <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.5em]">
            Sector_Not_Found
          </p>
        </div>

        <p className="text-zinc-500 text-sm italic opacity-60">
          The requested coordinate does not exist in the current grid.
        </p>

        {/* SIMPLE NAV PROTOCOLS */}
        <div className="flex flex-col gap-3 pt-6">
          <button 
            onClick={() => navigate("/app/salons")}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-violet-600 hover:text-white transition-all active:scale-95"
          >
            Return to Base
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-white/5 border border-white/5 text-zinc-500 font-bold uppercase tracking-widest text-[9px] rounded-2xl hover:text-white transition-colors"
          >
            Go Back
          </button>
        </div>

      </div>

      {/* FIXED KERNEL LABEL */}
      <div className="fixed bottom-8 text-[8px] font-mono text-zinc-800 uppercase tracking-widest">
        TrimBhai_v2.0_Null_Ref
      </div>
    </div>
  );
}