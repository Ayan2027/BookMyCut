import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchMySalon } from "../redux/salon/salonThunks";
import { fetchMyServices } from "../redux/service/serviceThunks";
import { fetchMySlots } from "../redux/slot/slotThunks";
import { logout } from "../redux/auth/authThunks";
import { LogOut, Scissors, HelpCircle, Wallet } from "lucide-react";
import toast from "react-hot-toast";

export default function SalonLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((s) => s.auth);
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
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col selection:bg-violet-500/30">
      
      {/* GLOBAL SALON HEADER */}
      <header className="h-20 border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
        
        {/* LEFT: BRAND */}
        <div className="flex items-center gap-6">
          <NavLink to="/salon/dashboard" className="flex items-center gap-4 group">
            <div className="h-10 w-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:scale-105 transition-transform">
              <Scissors size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black uppercase tracking-tighter italic leading-none">
                {salon?.name || "Studio_Internal"}
              </h2>
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                Node_Active: {salon?.city || "Global"}
              </span>
            </div>
          </NavLink>
        </div>

        {/* RIGHT: NAVIGATION */}
        <div className="flex items-center gap-3">

          {/* 💰 FINANCE / EARNINGS */}
          {/* <NavLink 
            to="/salon/finance" 
            className={({ isActive }) => `
              flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300
              ${isActive 
                ? 'bg-violet-500/10 border-violet-500/50 text-violet-400' 
                : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/30 hover:text-white'
              }
            `}
          >
            <Wallet size={16} />
            <span className="hidden lg:block text-[10px] font-mono uppercase tracking-widest">
              Earnings
            </span>
          </NavLink> */}

          {/* SUPPORT */}
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `
              flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300
              ${isActive 
                ? 'bg-violet-500/10 border-violet-500/50 text-violet-400' 
                : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/30 hover:text-white'
              }
            `}
          >
            <HelpCircle size={16} />
            <span className="hidden lg:block text-[10px] font-mono uppercase tracking-widest">
              Contact Us
            </span>
          </NavLink>

          <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />

          {/* LOGOUT */}
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 px-5 py-2.5 rounded-2xl transition-all duration-300"
          >
            <span className="hidden md:block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-hover:text-red-400 transition-colors">
              Exit_System
            </span>
            <LogOut size={16} className="text-zinc-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-violet-600/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-white/5 py-8 px-6 lg:px-12 bg-black/20 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] font-mono uppercase tracking-[0.4em]">
               Satellite_Link_Stable // Studio_Protocol
             </p>
          </div>
          <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest">
            <NavLink to="/contact" className="hover:text-violet-400">Request_Assistance</NavLink>
            <span className="text-zinc-800">|</span>
            <span className="text-zinc-600">v2.0.4_Stable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}