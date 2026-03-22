import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Calendar,
  Scissors,
  Wallet,
  Plus,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { salon } = useSelector((s) => s.salon);
  const { list: services } = useSelector((s) => s.service);
  const { list: slots } = useSelector((s) => s.slot);

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 p-6 lg:p-12 overflow-hidden selection:bg-violet-500/30">
      {/* 1. LAYER ZERO: Animated Mesh Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse duration-[4s]" />
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* 2. HEADER: Integrated Glass Section */}
        <header className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-violet-400/80">
                  Hyper-Terminal v2.0
                </span>
              </div>
              <h2 className="text-6xl font-extrabold tracking-tighter italic bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
                {salon?.name || "THE ATELIER"}
              </h2>
              <p className="text-zinc-500 font-medium tracking-wide">
                {salon?.city} <span className="mx-2 text-zinc-800">/</span>
                <span className="text-zinc-300 uppercase text-sm tracking-widest">
                  {salon?.status}
                </span>
              </p>
            </div>

            <div className="mt-6 md:mt-0 flex flex-col items-end">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <span className="text-sm font-mono text-violet-300">
                  SECURE_NODE_ACTIVE
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. STATS: Neumorphic Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/salon/services">
            <StatCard
              label="Catalog"
              value={services?.length || 0}
              unit="Services"
              icon={<Scissors size={24} />}
              color="violet"
            />
          </Link>
          <Link to="/salon/slots">
            <StatCard
              label="Availability"
              value={slots?.length || 0}
              unit="Active Slots"
              icon={<Calendar size={24} />}
              color="blue"
            />
          </Link>
          <Link to="/salon/revenue">
            <StatCard
              label="Revenue"
              // Dynamically pulling balance from salon state
              value={`₹${salon?.balance || 0}`}
              // Showing lifetime earnings as the sub-unit
              unit={`Lifetime: ₹${salon?.lifetimeEarnings || 0}`}
              icon={<Wallet size={24} />}
              color="emerald"
            />
          </Link>
        </div>

        {/* 4. QUICK ACTIONS: The Bento Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                <Zap className="text-yellow-400 fill-yellow-400/20" />
                Quick Dispatch
              </h3>
              <div className="flex flex-wrap gap-4">
                <AdvancedButton
                  label="Add Service"
                  icon={<Plus />}
                  onClick={() => navigate("/salon/services")}
                />
                <AdvancedButton
                  label="Sync Slots"
                  icon={<Calendar />}
                  onClick={() => navigate("/salon/slots")}
                />
              </div>
            </div>
            {/* Decorative Background Icon */}
            <LayoutGrid className="absolute -bottom-10 -right-10 size-64 text-white/[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>

          <button
            onClick={() => navigate("/salon/bookings")}
            className="group relative bg-violet-600 rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden hover:bg-violet-500 transition-colors"
          >
            <div className="absolute top-0 right-0 p-8">
              <ArrowRight
                size={40}
                className="-rotate-45 group-hover:rotate-0 transition-transform text-white/50"
              />
            </div>
            <div className="mt-20">
              <p className="text-white/60 uppercase tracking-widest text-xs font-bold mb-2">
                Live Monitor
              </p>
              <h3 className="text-3xl font-bold text-white">
                View
                <br />
                Bookings
              </h3>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon, color }) {
  const colors = {
    violet: "group-hover:text-violet-400 border-violet-500/20",
    blue: "group-hover:text-blue-400 border-blue-500/20",
    emerald: "group-hover:text-emerald-400 border-emerald-500/20",
  };

  return (
    <div
      className={`group relative bg-white/[0.02] border border-white/10 ${colors[color]} hover:bg-white/[0.05] rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2`}
    >
      <div className="flex justify-between items-start mb-10">
        <div className="p-4 bg-black rounded-2xl border border-white/5 group-hover:border-white/20 transition-colors text-zinc-400">
          {icon}
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
          {label}
        </div>
      </div>
      <div>
        <h4 className="text-5xl font-light tracking-tighter mb-1 transition-transform">
          {value}
        </h4>
        <p className="text-xs text-zinc-500 font-mono tracking-widest">
          {unit}
        </p>
      </div>
    </div>
  );
}

function AdvancedButton({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-violet-400 transition-all active:scale-95"
    >
      {icon}
      {label}
    </button>
  );
}