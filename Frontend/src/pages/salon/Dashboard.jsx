import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutGrid,
  Calendar,
  Scissors,
  Wallet,
  Plus,
  ArrowRight,
  Zap,
  MapPin,
  Star,
  Activity,
  Users,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { salon } = useSelector((s) => s.salon);
  const { list: services } = useSelector((s) => s.service);
  const { list: slots } = useSelector((s) => s.slot);

  const isApproved = salon?.status === "APPROVED";

  return (
    <div className="relative min-h-screen bg-[#050505] text-zinc-100 p-4 md:p-8 lg:p-12 overflow-x-hidden selection:bg-violet-500/30">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse duration-[8s]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HERO */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 relative group overflow-hidden rounded-[3rem] border border-white/10 bg-zinc-900/40 backdrop-blur-sm">
            <div className="absolute inset-0 z-0">
              <img
                src={salon?.image}
                alt={salon?.name}
                className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
            </div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end min-h-[400px]">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border ${isApproved ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"}`}
                >
                  {salon?.status}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  v2.0 Stable Build
                </span>
              </div>

              <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                {salon?.name || "UNNAMED"}
              </h1>

              <p className="max-w-xl text-lg text-zinc-400 font-medium leading-relaxed mb-4">
                {salon?.description ||
                  "No description provided for this establishment."}
              </p>

              {/* ⭐ NEW INFO */}
              <div className="flex items-center gap-4 mb-6 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500" />
                  {salon?.averageRating || 0}
                </div>

                <span className="h-1 w-1 bg-zinc-700 rounded-full" />

                <div>{salon?.totalReviews || 0} Reviews</div>

                <span className="h-1 w-1 bg-zinc-700 rounded-full" />

                <div>{salon?.totalBookings || 0} Bookings</div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-zinc-300">
                  <MapPin size={18} className="text-violet-500" />
                  {salon?.address}, {salon?.city}
                </div>

                <a
                  href={salon?.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <ExternalLink size={20} />
                  Location
                </a>
              </div>
            </div>
          </div>

          {/* SIDE CARDS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-violet-500/20 rounded-2xl text-violet-400">
                  <Users size={24} />
                </div>
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  Total Reach
                </span>
              </div>
              <div className="text-5xl font-bold tracking-tighter">
                {salon?.totalBookings || 0}
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">
                Completed Bookings
              </div>
            </div>

            <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                  <MessageSquare size={24} />
                </div>
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  Client Feedback
                </span>
              </div>
              <div className="text-5xl font-bold tracking-tighter">
                {salon?.totalReviews || 0}
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">
                Verified Reviews
              </div>
            </div>
          </div>
        </section>

        {/* ✅ FIXED FINANCIAL STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Pending Payout"
            // 🔥 Inject the color directly here
            value={
              <span
                className={
                  salon?.balance > 0 ? "text-rose-500" : "text-emerald-500"
                }
              >
                ₹{salon?.balance || 0}
              </span>
            }
            unit={
              salon?.balance > 0 ? "Outstanding balance" : "All payouts settled"
            }
            icon={
              <Wallet
                size={22}
                className={
                  salon?.balance > 0 ? "text-rose-500" : "text-emerald-500"
                }
              />
            }
            color={salon?.balance > 0 ? "rose" : "emerald"}
            // link="/salon/revenue"
          />

          <StatCard
            label="Total Earnings"
            value={`₹${salon?.lifetimeEarnings || 0}`}
            unit="Lifetime earnings"
            icon={<Zap size={22} />}
            color="violet"
            // link="/salon/revenue"
          />

          <StatCard
            label="Service Count"
            value={services?.length || 0}
            unit="Active Listings"
            icon={<Scissors size={22} />}
            color="blue"
            // link="/salon/services"
          />
        </div>

        {/* ACTION SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[3rem] p-10 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Activity className="text-violet-500" />
                Quick Operations
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/salon/services")}
                  className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-violet-400 transition-all flex items-center gap-2"
                >
                  <Plus size={20} /> Add Service
                </button>
                <button
                  onClick={() => navigate("/salon/slots")}
                  className="bg-zinc-800 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-all"
                >
                  Generate Slots
                </button>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/5 blur-[100px]" />
          </div>

          <Link
            to="/salon/bookings"
            className="group bg-violet-600 rounded-[3rem] p-10 flex flex-col justify-between hover:bg-violet-500 transition-all relative overflow-hidden"
          >
            <ArrowRight
              size={48}
              className="self-end -rotate-45 group-hover:rotate-0 transition-transform duration-500 text-white/40"
            />
            <div>
              <p className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2">
                Inbound Flow
              </p>
              <h3 className="text-4xl font-black text-white leading-none">
                CHECK
                <br />
                BOOKINGS
              </h3>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-[20px] border-white/5 rounded-full" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon, color, link }) {
  const themes = {
    violet: "group-hover:text-violet-400 border-violet-500/20",
    blue: "group-hover:text-blue-400 border-blue-500/20",
    emerald: "group-hover:text-emerald-400 border-emerald-500/20",
  };

  return (
    <Link
      to={link}
      className={`group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05] ${themes[color]}`}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 bg-black rounded-2xl border border-white/5 group-hover:border-current transition-colors">
          {icon}
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">
          {label}
        </div>
      </div>
      <div>
        <h4 className="text-5xl font-bold tracking-tighter text-white mb-1">
          {value}
        </h4>
        <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
          {unit}
        </p>
      </div>
    </Link>
  );
}
