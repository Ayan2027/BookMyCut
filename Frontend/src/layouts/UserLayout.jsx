import { Outlet, NavLink } from "react-router-dom";
import { Home, Compass, Package, Scissors, Bell, User as UserIcon, Settings } from "lucide-react";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-100 overflow-hidden">
      {/* 1. LAYERED SIDEBAR: The Command Column */}
      <aside className="w-72 border-r border-white/5 bg-[#080808] flex flex-col relative">
        {/* Subtle Side-Glow */}
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-violet-500/20 to-transparent" />
        
        {/* BRAND IDENTITY */}
        <div className="p-8">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="h-10 w-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">
              <Scissors size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter italic text-white uppercase leading-none">
                TrimBhai
              </h2>
              <span className="text-[9px] font-mono text-zinc-600 tracking-[0.3em] uppercase">User_Terminal</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION: Floating Pills */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em] px-4 mb-4">Core_Systems</div>
          
          <SidebarLink to="/app" icon={<Home size={18} />} label="Home" end />
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

      {/* 2. MAIN CANVAS: Integrated Top-Bar + Content */}
      <div className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        
        {/* TOP BAR: Glassmorphic Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-10 py-6 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <h1 className="text-sm font-mono tracking-widest text-zinc-400 uppercase">System_Healthy</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-zinc-500 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-violet-500 rounded-full border-2 border-[#050505]" />
            </button>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
              <span className="text-[10px] font-mono font-bold text-violet-400 tracking-tighter italic uppercase">Quick_Access_Enabled</span>
            </div>
          </div>
        </header>

        {/* 3. SCENE CONTENT */}
        <main className="flex-1 p-10 relative">
          {/* Background Ambient Glow for Content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/[0.02] blur-[150px] pointer-events-none" />
          
          <div className="relative z-0">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub-component: High-Fidelity Sidebar Link
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
      <div className={`transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <span className="text-xs font-bold tracking-[0.1em] uppercase">{label}</span>
      
      {/* Indicator Dot for Inactive Hover */}
      <NavLink className={({ isActive }) => isActive ? "" : "absolute right-4 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"} />
    </NavLink>
  );
}