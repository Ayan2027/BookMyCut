import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, Scissors, Package, CreditCard, 
  Building2, Users, ScrollText, Landmark, 
  ChevronRight, ShieldCheck, Activity, Menu, X 
} from "lucide-react";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile drawer when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-[#030303] text-zinc-100 selection:bg-violet-500/30 overflow-hidden relative">
      
      {/* MOBILE TOP HEADER (Visible only on small screens) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505] border-b border-white/5 flex items-center justify-between px-6 z-[60] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-white" />
          <span className="text-xs font-black uppercase tracking-tighter italic">Root_Admin</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-violet-600 rounded-lg text-white"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 1. SIDEBAR: THE CONTROL_HUB */}
      <aside className={`
        fixed inset-y-0 left-0 z-[80] transition-transform duration-500 ease-in-out border-r border-white/5 bg-[#050505] flex flex-col
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? "w-72" : "w-20"} 
        ${isMobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full"}
      `}>
        
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 bg-violet-600 rounded-full items-center justify-center border border-white/10 hover:scale-110 transition-transform z-50"
        >
          {isSidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </button>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-6 right-6 text-zinc-500"
        >
          <X size={20} />
        </button>

        {/* BRAND IDENTITY */}
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 shrink-0 bg-white text-black rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <ShieldCheck size={20} />
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="animate-in fade-in slide-in-from-left-4">
                <h2 className="text-xl font-black tracking-tighter italic text-white uppercase leading-none">Root_Admin</h2>
                <span className="text-[9px] font-mono text-emerald-500 tracking-[0.3em] uppercase animate-pulse">Kernel_Online</span>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION: COMMANDS */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className={`text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em] px-4 mb-4 ${(!isSidebarOpen && !isMobileMenuOpen) && "hidden"}`}>
            System_Control
          </div>
          
          <AdminLink to="/admin" icon={<BarChart3 size={18} />} label="Dashboard" expanded={isSidebarOpen || isMobileMenuOpen} />
          <AdminLink to="/admin/salons" icon={<Building2 size={18} />} label="Salons" expanded={isSidebarOpen || isMobileMenuOpen} />
          <AdminLink to="/admin/bookings" icon={<Package size={18} />} label="Bookings" expanded={isSidebarOpen || isMobileMenuOpen} />
          
          <div className="h-px bg-white/5 mx-4 my-6" />
          
          <div className={`text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em] px-4 mb-4 ${(!isSidebarOpen && !isMobileMenuOpen) && "hidden"}`}>
            Financial_ledger
          </div>
          <AdminLink to="/admin/payments" icon={<CreditCard size={18} />} label="Payments" expanded={isSidebarOpen || isMobileMenuOpen} />
          <AdminLink to="/admin/payouts" icon={<Landmark size={18} />} label="Payouts" expanded={isSidebarOpen || isMobileMenuOpen} />

          <div className="h-px bg-white/5 mx-4 my-6" />

          <div className={`text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em] px-4 mb-4 ${(!isSidebarOpen && !isMobileMenuOpen) && "hidden"}`}>
            User_Protocol
          </div>
          <AdminLink to="/admin/users" icon={<Users size={18} />} label="Users" expanded={isSidebarOpen || isMobileMenuOpen} />
          <AdminLink to="/admin/logs" icon={<ScrollText size={18} />} label="Logs" expanded={isSidebarOpen || isMobileMenuOpen} />
        </nav>

        {/* STATUS FOOTER */}
        <div className="p-6 mt-auto border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="relative">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping absolute inset-0" />
                <div className="h-2 w-2 bg-emerald-500 rounded-full relative" />
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Server: AS_1</span>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden mt-16 lg:mt-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/[0.03] blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 p-6 lg:p-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminLink({ to, icon, label, expanded }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
        ${isActive 
          ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]' 
          : 'text-zinc-500 hover:text-white hover:bg-white/5'
        }
      `}
    >
      <div className="shrink-0">{icon}</div>
      {expanded && (
        <span className="text-[11px] font-bold uppercase tracking-widest">
            {label}
        </span>
      )}
    </NavLink>
  );
}