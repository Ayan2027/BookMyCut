import { useState } from "react";
import { useDispatch } from "react-redux";
import { applySalon, fetchMySalon } from "../../redux/salon/salonThunks";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, MapPin, Phone, Building2, Sparkles, ArrowRight } from "lucide-react";

export default function Apply() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(applySalon(form));
    await dispatch(fetchMySalon());
    navigate("/salon");
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* BACKGROUND AMBIENCE */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[500px] group relative">
        {/* BORDER GLOW ANIMATION */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          
          {/* HEADER: ELITE BRANDING */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
              <Building2 className="text-violet-400" size={32} />
            </div>
            <h2 className="text-4xl font-black tracking-tighter italic bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              PARTNER_ENROLL
            </h2>
            <p className="text-zinc-500 font-mono text-[10px] tracking-[0.3em] mt-2 uppercase">
              Operational Access Request
            </p>
          </div>

          {/* FORM: NEURAL INPUTS */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <EliteInput 
              label="Salon Identity"
              name="name"
              icon={<Sparkles size={18} />}
              placeholder="e.g. THE CUTTING EDGE"
              value={form.name}
              onChange={handleChange}
            />

            <EliteInput 
              label="Physical Coordinates"
              name="address"
              icon={<MapPin size={18} />}
              placeholder="Street, City, Sector"
              value={form.address}
              onChange={handleChange}
            />

            <EliteInput 
              label="Secure Communication"
              name="phone"
              icon={<Phone size={18} />}
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={handleChange}
            />

            {/* SUBMIT: THE COMMAND BUTTON */}
            <button
              type="submit"
              className="group relative w-full h-14 mt-4 overflow-hidden rounded-2xl bg-white text-black font-black uppercase tracking-widest transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-blue-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                Initialize Application
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>

          {/* FOOTER: SYSTEM STATUS */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              Verified_Secure_Protocol
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ADVANCED COMPONENT: Elite Floating Input
function EliteInput({ label, name, icon, placeholder, value, onChange }) {
  return (
    <div className="space-y-2 group/input">
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 group-focus-within/input:text-violet-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center text-zinc-600 group-focus-within/input:text-violet-400 transition-colors">
          {icon}
        </div>
        <input
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-medium"
          required
        />
      </div>
    </div>
  );
}