import { useSelector } from "react-redux";
import { Clock, XCircle, CheckCircle2, ShieldCheck, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ApplicationStatus() {
  const { status, salon } = useSelector((s) => s.salon);
  const navigate = useNavigate();

  // 1. PENDING STATE
  if (status === "PENDING") {
    return (
      <div className="min-h-[100vh] flex items-center justify-center p-6 bg-[#030303]">
        <div className="max-w-md w-full text-center space-y-8">
          
          {/* Animated Loader & Icon */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-violet-600/20 rounded-full animate-ping opacity-25" />
            <div className="relative h-24 w-24 bg-[#080808] rounded-full flex items-center justify-center border border-white/5 shadow-2xl">
              <Clock className="text-violet-500 animate-[spin_3s_linear_infinite]" size={40} />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Application Under Review
            </h1>
            <p className="text-zinc-500 leading-relaxed">
              Thanks for applying, <span className="font-semibold text-zinc-300">{salon?.name}</span>! 
              Our team is currently verifying your documents and studio details.
            </p>
          </div>

          {/* Progress Steps Visual */}
          <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 space-y-4">
            <StatusStep completed={true} label="Application Submitted" />
            <StatusStep active={true} label="Identity & Document Verification" />
            <StatusStep label="Final Approval & Live Access" />
          </div>

          <div className="pt-4 space-y-4">
            <p className="text-xs text-zinc-600">
              Typical review time: 24-48 business hours.
            </p>
            {/* <button 
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet-500 hover:text-violet-400 transition-colors"
            >
              <ArrowLeft size={16} /> Return to Home
            </button> */}
          </div>
        </div>
      </div>
    );
  }

  // 2. REJECTED STATE
  if (status === "REJECTED") {
    return (
      <div className="min-h-[100vh] flex items-center justify-center p-6 bg-[#030303]">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="h-20 w-20 bg-red-500/5 rounded-full flex items-center justify-center mx-auto border border-red-500/10">
            <XCircle className="text-red-500" size={40} />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Application Update
            </h1>
            <p className="text-zinc-500 leading-relaxed">
              We've completed the review of your application for <span className="font-semibold text-zinc-300">{salon?.name}</span>.
              Unfortunately, we cannot approve your request at this time.
            </p>
          </div>

          <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/10 text-left space-y-2">
            <p className="text-xs font-bold text-red-500/60 uppercase tracking-wider">Rejection Reason:</p>
            <p className="text-sm text-zinc-400 leading-relaxed italic">
              "{salon?.rejectionReason || "Please contact our support team for detailed feedback regarding your registration."}"
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-lg">
              Contact Support
            </button>
            <button 
              onClick={() => navigate("/apply")}
              className="w-full py-4 bg-transparent text-zinc-400 border border-white/10 font-bold rounded-xl hover:bg-white/5 transition-all"
            >
              Re-submit Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Helper Component for the Progress List
function StatusStep({ label, completed = false, active = false }) {
  return (
    <div className={`flex items-center gap-3 text-sm ${active || completed ? 'text-zinc-300' : 'text-zinc-600'}`}>
      {completed ? (
        <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
      ) : active ? (
        <div className="h-[18px] w-[18px] border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        <div className="h-[18px] w-[18px] border-2 border-zinc-800 rounded-full shrink-0" />
      )}
      <span className={active ? "font-bold text-violet-400" : "font-medium"}>{label}</span>
    </div>
  );
}