import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchMySalon } from "../redux/salon/salonThunks";
import { fetchMyServices } from "../redux/service/serviceThunks";
import { fetchMySlots } from "../redux/slot/slotThunks";
import { logout } from "../redux/auth/authThunks"; // Corrected path
import { LogOut, Scissors, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function SalonLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role, user } = useSelector((s) => s.auth);
  const { salon } = useSelector((s) => s.salon);

  useEffect(() => {
    if (role === "SALON") {
      dispatch(fetchMySalon());
      dispatch(fetchMyServices());
      dispatch(fetchMySlots());
    }
  }, [role, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Protocol_Terminated: Session Closed");
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col">
      {/* GLOBAL SALON HEADER */}
      <header className="h-20 border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <Scissors size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tighter italic leading-none">
              {salon?.name || "Studio_Internal"}
            </h2>
            
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button 
          onClick={handleLogout}
          className="group flex items-center gap-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 px-5 py-2.5 rounded-2xl transition-all duration-300"
        >
          <span className="hidden md:block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-hover:text-red-400 transition-colors">
            Exit_System
          </span>
          <LogOut size={16} className="text-zinc-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative">
        {/* Ambient background glow to match Admin/Apply styles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-violet-600/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}