import { Outlet, NavLink } from "react-router-dom";
import { Scissors, Compass, LogIn, UserPlus, Briefcase, Zap } from "lucide-react";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 selection:bg-violet-500/30">
      {/* 1. DYNAMIC ATMOSPHERE (Global Background) */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-violet-600/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* 2. ELITE FLOATING NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 py-6">
        <nav className="flex justify-between items-center w-full max-w-7xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:border-white/20">
          
          {/* BRAND IDENTITY */}
          <NavLink to="/" className="group flex items-center gap-3">
            <div className="h-10 w-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform duration-500">
              <Scissors className="text-white" size={20} />
            </div>
            <span className="text-3xl font-black tracking-tighter italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              BookMyCut
            </span>
          </NavLink>

          {/* NAVIGATION LINKS */}
          <div className="hidden md:flex items-center gap-1">
            <NavTab to="/salons" icon={<Compass size={16} />} label="Browse" />
            <div className="w-px h-4 bg-white/10 mx-4" />
            <NavTab to="/login" icon={<LogIn size={16} />} label="Login" />
            <NavTab to="/signup" icon={<UserPlus size={16} />} label="Join" />
            
            {/* CTA: PARTNER BUTTON */}
            <NavLink 
              to="/salon" 
              className={({ isActive }) => `
                ml-4 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all
                ${isActive 
                  ? 'bg-white text-black' 
                  : 'bg-violet-600 text-white hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]'
                }
              `}
            >
              <Briefcase size={14} />
              Become a Partner
            </NavLink>
          </div>

          {/* MOBILE TOGGLE (Ghost Icon) */}
          <button className="md:hidden p-2 text-zinc-400">
            <Zap size={20} />
          </button>
        </nav>
      </header>

      {/* 3. CONTENT AREA */}
      <main className="pt-32 pb-20">
        <Outlet />
      </main>

      {/* 4. MINIMALIST SYSTEM FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">
            © 2026 TrimBhai_Global_Operations
          </p>
          <div className="flex gap-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy_Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Service_Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-component: Advanced Nav Tab
function NavTab({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        relative px-5 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all group
        ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}
      `}
    >
      {icon}
      {label}
      {/* Active Indicator Underline */}
      <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-violet-500 scale-x-0 group-hover:scale-x-50 transition-transform origin-center" />
      <NavLink className={({ isActive }) => isActive ? "absolute bottom-[-18px] left-0 right-0 h-[2px] bg-violet-500 scale-x-100" : ""} />
    </NavLink>
  );
}