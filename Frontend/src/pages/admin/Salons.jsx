import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchAdminOverview,
  approveSalon,
  rejectSalon,
  suspendSalon
} from "../../redux/admin/adminThunks";
import { adminService } from "../../services/admin.service";
import {
  Store,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Filter,
  Search,
  Activity,
  RefreshCw,
  MoreVertical
} from "lucide-react";

export default function AdminSalons() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("PENDING");
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, [status]);

  const load = async () => {
    setIsRefreshing(true);
    try {
      const res = await adminService.getSalonsByStatus(status);
      setList(res.data);
    } catch (err) {
      setList([]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const statusConfig = [
    { value: "PENDING", label: "PENDING", icon: Clock, color: "text-amber-500", glow: "bg-amber-500/10" },
    { value: "APPROVED", label: "APPROVED_SALONS", icon: CheckCircle, color: "text-emerald-500", glow: "bg-emerald-500/10" },
    { value: "REJECTED", label: "REJECTED", icon: XCircle, color: "text-red-500", glow: "bg-red-500/10" },
    { value: "SUSPENDED", label: "SUSPENDED", icon: AlertCircle, color: "text-orange-500", glow: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8 selection:bg-violet-500/30 pb-12">
      
      {/* 1. HEADER: REGISTRY COMMAND */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-violet-500 font-mono text-[10px] tracking-[0.4em] uppercase">
             <Activity size={14} /> Database_Registry: {status}
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Salon_ <br/>
            <span className="text-zinc-400 outline-text">APPLICATIONS</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/[0.02] border border-white/5 p-2 rounded-2xl backdrop-blur-3xl w-full xl:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
            <input 
              type="text"
              placeholder="FILTER_BY_NODE_NAME..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none pl-12 pr-4 py-3 text-xs font-mono uppercase tracking-widest focus:outline-none text-violet-400 placeholder:text-zinc-800" 
            />
          </div>
          <button onClick={load} className={`p-3 bg-white/5 border border-white/10 rounded-xl transition-all ${isRefreshing ? 'animate-spin text-violet-500' : 'text-zinc-500 hover:text-white'}`}>
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* 2. TAB CONTROLS: STATUS_FILTERS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statusConfig.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`relative p-4 rounded-2xl border transition-all duration-500 group overflow-hidden ${
              status === s.value 
              ? `bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]` 
              : "bg-[#080808] border-white/5 text-zinc-600 hover:border-white/10"
            }`}
          >
            {status === s.value && <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zinc-200/50 opacity-10" />}
            <div className="flex items-center gap-3 relative z-10">
              <s.icon size={18} className={status === s.value ? "text-black" : s.color} />
              <div className="text-left">
                <p className="text-[10px] font-mono uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <p className={`text-lg font-black italic leading-none ${status === s.value ? "text-black" : "text-zinc-400"}`}>
                  {s.value === status ? list.length : '--'}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 3. DATA LIST: SECTOR_NODES */}
      <div className="space-y-4">
        {list.length === 0 && !isRefreshing ? (
          <div className="py-32 text-center border border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
             <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.5em]">Zero_Nodes_Found_In_Sector</p>
          </div>
        ) : (
          list.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((salon) => (
            <SalonRegistryRow 
              key={salon._id} 
              salon={salon} 
              onApprove={() => { dispatch(approveSalon(salon._id)); load(); dispatch(fetchAdminOverview()); }}
              onReject={() => { dispatch(rejectSalon({ salonId: salon._id, reason: "Manual_Denial" })); load(); dispatch(fetchAdminOverview()); }}
              onSuspend={() => { dispatch(suspendSalon(salon._id)); load(); dispatch(fetchAdminOverview()); }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SalonRegistryRow({ salon, onApprove, onReject, onSuspend }) {
  return (
    <div className="group bg-[#080808] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.02] hover:border-white/10 transition-all duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* NODE INFO */}
        <div className="flex items-center gap-6">
          <div className="h-14 w-14 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
            <Store size={24} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">{salon.name}</h3>
            <div className="flex flex-wrap items-center gap-4 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
              <span className="flex items-center gap-1"><MapPin size={10} className="text-violet-500" /> {salon.city}</span>
              <span className="flex items-center gap-1"><Phone size={10} className="text-emerald-500" /> {salon.phone}</span>
              <span className="text-zinc-800 font-bold">UID: {salon._id.slice(-6)}</span>
            </div>
          </div>
        </div>

        {/* COMMAND ACTIONS */}
        <div className="flex flex-wrap gap-2">
          {salon.status === "PENDING" && (
            <>
              <AdminButton onClick={onApprove} icon={CheckCircle} label="Authorize" color="hover:bg-emerald-500" />
              <AdminButton onClick={onReject} icon={XCircle} label="Terminate" color="hover:bg-red-500" />
            </>
          )}
          {salon.status === "APPROVED" && (
            <AdminButton onClick={onSuspend} icon={AlertCircle} label="Quarantine" color="hover:bg-orange-500" />
          )}
          {(salon.status === "REJECTED" || salon.status === "SUSPENDED") && (
            <AdminButton onClick={onApprove} icon={RefreshCw} label="Re-Initialize" color="hover:bg-violet-500" />
          )}
          <button className="p-3 bg-white/5 rounded-xl text-zinc-700 hover:text-white transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminButton({ onClick, icon: Icon, label, color }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 transition-all duration-300 ${color} hover:text-black hover:scale-105 active:scale-95`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}