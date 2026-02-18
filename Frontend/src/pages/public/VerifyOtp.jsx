import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../redux/auth/authThunks";
import { toast } from "react-toastify";
import { ShieldCheck, Mail, ArrowRight, Loader2, RefreshCcw } from "lucide-react";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, loading, token } = useSelector((s) => s.auth);
  const [otp, setOtp] = useState("");

  // FIX: Hooks must always be called in the same order. 
  // Move useEffect above any conditional returns.
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle redirects inside the logic flow, not before hooks
  if (token) return <Navigate to="/" replace />;
  if (!location.state?.email) return <Navigate to="/signup" replace />;

  const handleVerify = async () => {
    // Basic validation before dispatch
    if (otp.length < 6) {
      toast.warn("Transmission code incomplete");
      return;
    }

    const res = await dispatch(
      verifyOtp({ email: location.state.email, otp })
    );

    if (verifyOtp.fulfilled.match(res)) {
      toast.success("Identity Verified");
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
      <div className="w-full max-w-[460px] relative group">
        
        {/* ATMOSPHERIC GLOW */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 to-violet-600/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-80 transition duration-1000" />

        <div className="relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
          
          <div className="mb-10 text-center">
            <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl mb-4">
              <ShieldCheck className="text-cyan-400" size={28} />
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
              Verify_Auth
            </h2>
            <div className="mt-4 px-4 py-2 bg-white/5 border border-white/5 rounded-xl inline-flex items-center gap-3">
              <Mail size={14} className="text-zinc-500" />
              <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px]">
                {location.state.email}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative group/input">
              <input
                type="text"
                inputMode="numeric" // Triggers numeric keyboard on mobile
                pattern="\d*"
                maxLength={6}
                placeholder="000000"
                value={otp}
                autoFocus
                onChange={(e) => {
                    // Only allow numbers
                    const val = e.target.value.replace(/\D/g, "");
                    setOtp(val);
                }}
                className="w-full bg-white/[0.03] border-2 border-white/10 rounded-2xl py-6 text-center text-4xl font-black tracking-[0.4em] text-cyan-400 placeholder:text-zinc-900 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all font-mono"
              />
              <p className="text-center mt-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                Input_6_Digit_Code
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleVerify} 
                disabled={loading || otp.length !== 6}
                className="group relative w-full h-14 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl overflow-hidden transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      Execute Verification
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              <button className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
                <RefreshCcw size={12} />
                Resend Signal
              </button>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-500/80 uppercase tracking-tighter">
                Link_Secured
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}