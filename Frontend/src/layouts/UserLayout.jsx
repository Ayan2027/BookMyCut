import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, Compass, Package, Scissors, Bell, User as UserIcon, Settings, Menu, X } from "lucide-react";

export default function UserLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close sidebar automatically when navigating on mobile
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-100 overflow-hidden relative">
      
      {/* MOBILE HAMBURGER BUTTON */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-violet-600 rounded-xl shadow-lg text-white active:scale-95 transition-transform"
      >
        <Menu size={20} />
      </button>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 1. LAYERED SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 border-r border-white/5 bg-[#080808] flex flex-col transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Subtle Side-Glow */}
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-violet-500/20 to-transparent" />
        
        {/* BRAND IDENTITY + MOBILE CLOSE */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="h-10 w-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Scissors size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter italic text-white uppercase leading-none">TrimBhai</h2>
              <span className="text-[9px] font-mono text-zinc-600 tracking-[0.3em] uppercase">User_Terminal</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em] px-4 mb-4">Core_Systems</div>
          <SidebarLink to="/app/salons" icon={<Compass size={18} />} label="Discover" />
          <SidebarLink to="/app/bookings" icon={<Package size={18} />} label="Bookings" />
          
          <div className="h-px bg-white/5 mx-4 my-6" />
          <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em] px-4 mb-4">Preference</div>
          <SidebarLink to="/app/profile" icon={<UserIcon size={18} />} label="Account" />
        </nav>

        {/* USER PREVIEW FOOTER */}
        <div className="p-6 mt-auto border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
              <UserIcon size={20} className="text-zinc-500" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate italic">Client_User</p>
              <p className="text-[9px] font-mono text-zinc-600 truncate">System_Active</p>
            </div>
            <Settings size={14} className="text-zinc-700 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* 2. MAIN CANVAS */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        <main className="flex-1 p-6 lg:p-10 relative">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/[0.02] blur-[150px] pointer-events-none" />
          
          <div className="relative z-0">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `
        group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300
        ${isActive 
          ? 'bg-violet-600 text-white shadow-[0_10px_20px_rgba(139,92,246,0.2)]' 
          : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
        }
      `}
    >
      <div className="transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <span className="text-xs font-bold tracking-[0.1em] uppercase">{label}</span>
    </NavLink>
  );
}