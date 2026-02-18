import { useNavigate } from "react-router-dom";
import { Lock, ChevronLeft, ShieldAlert } from "lucide-react";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex items-center justify-center p-6 selection:bg-violet-500/30">
      
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* LOCK INDICATOR */}
        <div className="flex justify-center">
            <div className="h-12 w-12 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center justify-center">
                <Lock size={20} className="text-red-500/50" />
            </div>
        </div>

        {/* ERROR MESSAGE */}
        <div className="space-y-2">
          <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-none">
            403_
          </h1>
          <p className="text-red-500/50 font-mono text-[10px] uppercase tracking-[0.5em]">
            Access_Restricted
          </p>
        </div>

        <p className="text-zinc-500 text-sm italic opacity-60">
          Your current authorization level is insufficient to access this terminal sector.
        </p>

        {/* SIMPLE NAV PROTOCOLS */}
        <div className="flex flex-col gap-3 pt-6">
          <button 
            onClick={() => navigate("/app/salons")}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
          >
            Return to Safety
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
        TrimBhai_v2.0_Auth_Fault
      </div>
    </div>
  );
}