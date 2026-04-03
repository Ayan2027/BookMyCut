import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
// Changed Zap to Menu
import { Scissors, Compass, LogIn, UserPlus, Briefcase, Menu, Globe, X } from "lucide-react";

export default function PublicLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 selection:bg-violet-500/30">
      {/* 1. DYNAMIC ATMOSPHERE */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-violet-600/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* 2. ELITE FLOATING NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-6 md:px-6">
        <nav className="relative flex justify-between items-center w-full max-w-7xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 px-6 md:px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:border-white/20">
          
          {/* BRAND IDENTITY */}
          <NavLink to="/" className="group flex items-center gap-3">
            <div className="h-10 w-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform duration-500">
              <Scissors className="text-white" size={20} />
            </div>
            <span className="text-2xl md:text-3xl font-black tracking-tighter italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              BookMyCut
            </span>
          </NavLink>

          {/* DESKTOP NAVIGATION LINKS */}
          <div className="hidden md:flex items-center gap-1">
            <NavTab to="/salons" icon={<Compass size={16} />} label="Browse" />
            <NavTab to="/contact" icon={<Globe size={16} />} label="Contact Us" />
            <div className="w-px h-4 bg-white/10 mx-4" />
            <NavTab to="/login" icon={<LogIn size={16} />} label="Login" />
            <NavTab to="/signup" icon={<UserPlus size={16} />} label="Join" />
            
            <NavLink 
              to="/salon" 
              className={({ isActive }) => `
                ml-4 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all
                ${isActive 
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-violet-600 text-white hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]'
                }
              `}
            >
              <Briefcase size={14} />
              Become a Partner
            </NavLink>
          </div>

          {/* MOBILE TOGGLE (Updated Icon) */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-all duration-300"
          >
            {isOpen ? (
              <X size={24} className="rotate-90 transition-transform duration-300" />
            ) : (
              <Menu size={24} className="hover:text-violet-400 transition-transform duration-300" />
            )}
          </button>

          {/* MOBILE DROPDOWN MENU */}
          {isOpen && (
            <div className="absolute top-[calc(100%+1rem)] left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] flex flex-col gap-2 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="px-4 py-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Navigation</div>
              <NavTab to="/salons" icon={<Compass size={18} />} label="Browse" onClick={toggleMenu} />
              <NavTab to="/contact" icon={<Globe size={18} />} label="Contact Us" onClick={toggleMenu} />
              
              <div className="h-px w-full bg-white/5 my-2" />
              
              <div className="px-4 py-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Account</div>
              <NavTab to="/login" icon={<LogIn size={18} />} label="Login" onClick={toggleMenu} />
              <NavTab to="/signup" icon={<UserPlus size={18} />} label="Join" onClick={toggleMenu} />
              
              <NavLink 
                to="/salon" 
                onClick={toggleMenu}
                className="mt-4 w-full justify-center bg-violet-600 text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-95 transition-transform"
              >
                <Briefcase size={16} />
                Become a Partner
              </NavLink>
            </div>
          )}
        </nav>
      </header>

      {/* 3. CONTENT AREA */}
      <main className="pt-32 pb-20">
        <Outlet />
      </main>

      {/* 4. FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
             <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">
               © 2026 TrimBhai_Global_Operations
             </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <NavLink to="/contact" className="hover:text-violet-400 transition-colors">Contact_Support</NavLink>
            <a href="#" className="hover:text-white transition-colors">Privacy_Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Service_Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavTab({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        relative px-5 py-3 md:py-2 flex items-center gap-3 md:gap-2 text-[11px] md:text-xs font-bold uppercase tracking-widest transition-all group
        ${isActive ? 'text-white bg-white/5 md:bg-transparent rounded-xl' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] md:hover:bg-transparent rounded-xl'}
      `}
    >
      {icon}
      <span>{label}</span>
      {/* Desktop Underline Indicators */}
      <span className="hidden md:block absolute bottom-[-18px] left-0 right-0 h-[2px] bg-violet-500 scale-x-0 group-hover:scale-x-50 transition-transform origin-center" />
      <div className="hidden md:block">
          <NavLink 
            to={to} 
            className={({ isActive }) => 
              isActive 
                ? "absolute bottom-[-18px] left-0 right-0 h-[2px] bg-violet-500 scale-x-100 transition-transform" 
                : "hidden"
            } 
          />
      </div>
    </NavLink>
  );
}