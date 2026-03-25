import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestOtp } from "../../redux/auth/authThunks";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Mail, Lock, User, Scissors, ShieldCheck, 
  ArrowRight, Loader2, Eye, EyeOff 
} from "lucide-react";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER"
  });

  if (token) return <Navigate to="/" replace />;

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const submit = async () => {
    const { email, password, confirmPassword } = form;

    // 1. Mandatory Field Check
    if (!email || !password || !confirmPassword) {
      toast.error("All authentication fields required");
      return;
    }

    // 2. Restricted Password Protocol
    // ^(?=.*[A-Za-z]) -> At least one letter
    // (?=.*\d)        -> At least one digit
    // .{6,10}$        -> Length between 6 and 10
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,10}$/;

    if (!passwordRegex.test(password)) {
      toast.error("Password must be 6-10 chars with letters & digits");
      return;
    }

    // 3. Mismatch Verification
    if (password !== confirmPassword) {
      toast.error("Password Mismatch: Verify Credentials");
      return;
    }

    const res = await dispatch(requestOtp(form));
    if (requestOtp.fulfilled.match(res)) {
      navigate("/verify-otp", { state: { email: form.email } });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] group relative">
        {/* ATMOSPHERIC GLOW */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-sky-600/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000" />

        <div className="relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
          
          {/* HEADER */}
          <div className="mb-10 text-center">
            <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-2xl mb-4">
              <ShieldCheck className="text-violet-400" size={28} />
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              Establish_ID
            </h2>
            <p className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] mt-2 uppercase">
              Secure Protocol Initialization
            </p>
          </div>

          <div className="space-y-6">
            {/* ROLE SELECTION */}
            <div className="grid grid-cols-2 gap-4">
              <RoleCard 
                active={form.role === "USER"} 
                onClick={() => setForm({...form, role: "USER"})}
                icon={<User size={18} />}
                label="Client"
                description="Booking services"
              />
              <RoleCard 
                active={form.role === "SALON"} 
                onClick={() => setForm({...form, role: "SALON"})}
                icon={<Scissors size={18} />}
                label="Partner"
                description="Providing services"
              />
            </div>

            {/* INPUT FIELDS */}
            <div className="space-y-4">
              <EliteInput 
                icon={<Mail size={18} />}
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <EliteInput 
                isPassword
                icon={<Lock size={18} />}
                placeholder="Secure Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <EliteInput 
                isPassword
                icon={<ShieldCheck size={18} />}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>

            {/* ACTION BUTTON */}
            <button 
              onClick={submit} 
              disabled={loading}
              className="group relative w-full h-14 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-sky-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    Send OTP Signal
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>

          <p className="mt-8 text-center text-zinc-600 text-[10px] font-mono tracking-widest uppercase">
            Encrypted data transmission active
          </p>
        </div>
      </div>
    </div>
  );
}

// COMPONENT: Elite Input with Visibility Toggle
function EliteInput({ isPassword = false, icon, placeholder, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative group/input">
      <div className="absolute inset-y-0 left-4 flex items-center text-zinc-600 group-focus-within/input:text-violet-400 transition-colors">
        {icon}
      </div>
      <input
        type={isPassword ? (show ? "text" : "password") : "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-medium"
      />
      
      {isPassword && (
        <button
          type="button"
          tabIndex="-1" // Prevent tab focusing the eye icon
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-4 flex items-center text-zinc-600 hover:text-violet-400 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

function RoleCard({ active, onClick, icon, label, description }) {
  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${
        active 
          ? "bg-violet-500/10 border-violet-500/50" 
          : "bg-white/5 border-white/5 hover:border-white/20"
      }`}
    >
      <div className={`${active ? "text-violet-400" : "text-zinc-500"} mb-3 transition-colors`}>
        {icon}
      </div>
      <p className={`text-sm font-bold uppercase tracking-tighter ${active ? "text-white" : "text-zinc-400"}`}>
        {label}
      </p>
      <p className="text-[10px] text-zinc-600 font-medium leading-tight mt-1">
        {description}
      </p>
      {active && (
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,1)]" />
      )}
    </button>
  );
}