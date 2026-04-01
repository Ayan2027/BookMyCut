import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/auth/authThunks";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Fingerprint, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (token) {
      toast.success("Authentication Successful");
      navigate("/");
    }
  }, [token, navigate]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] px-4 relative overflow-hidden">
      
      {/* 1. ATMOSPHERIC BACKDROP */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-[440px] relative group">
        
        {/* 2. OUTER GLOW EFFECT */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-[2.5rem] blur-2xl group-hover:opacity-100 transition duration-1000 opacity-50"></div>

        <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          
          {/* 3. LOGO & BRANDING */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 mb-6 group-hover:rotate-[10deg] transition-transform duration-500">
              <Fingerprint className="text-violet-400" size={28} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">
              BookMyCut
            </h1>
            {/* <p className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] mt-2 uppercase">
              Terminal Access v2.0
            </p> */}
          </div>

          {/* 4. AUTH FORM */}
          <form onSubmit={submit} className="space-y-6">
            
            <EliteInput 
              label="Email Address"
              type="email"
              placeholder="operator@quicktrim.io"
              icon={<Mail size={18} />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="relative">
              <EliteInput 
                label="Secure Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-4 text-zinc-600 hover:text-white transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* 5. ACTION BUTTON */}
            <button
              disabled={loading}
              className="group relative w-full h-14 mt-4 overflow-hidden rounded-2xl bg-white text-black font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Login
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* 6. SECONDARY NAVIGATION */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-zinc-500 font-medium">
              Awaiting credentials?{" "}
              <Link to="/signup" className="text-white hover:text-violet-400 transition-colors underline underline-offset-4">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-component: Advanced Ghost Input
function EliteInput({ label, type, placeholder, icon, value, onChange }) {
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
          type={type}
          required
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-medium"
        />
      </div>
    </div>
  );
}