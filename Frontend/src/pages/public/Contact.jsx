import React, { useState } from 'react';
import { Mail, ShieldCheck, HelpCircle, RefreshCcw, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const supportEmail = "bookmycut2026@gmail.com";

  // FORCED UPLINK LOGIC
  const handleEmailClick = () => {
    const subject = encodeURIComponent("Support Request - BookMyCut");
    const body = encodeURIComponent("Please describe your issue here (Include Phone Number/Booking ID)...");
    const mailtoUrl = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    
    // Method 1: Standard location trigger
    window.location.href = mailtoUrl;
    
    // Method 2: Fallback for some browsers
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.click();
    }, 500);
  };

  const copyToClipboard = (e) => {
    e.stopPropagation(); // Prevents triggering the mailto card
    navigator.clipboard.writeText(supportEmail);
    
    setCopied(true);
    toast.success("Identity_Copied: System Ready");
    
    // Reset "Copied" state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 p-6 lg:p-12 overflow-hidden selection:bg-violet-500/30">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse duration-[4s]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-16 space-y-4">
          <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">
            Contact_Us <br/>
            {/* <span className="text-zinc-500 outline-text">Us</span> */}
          </h1>
          <p className="max-w-xl text-zinc-500 font-light leading-relaxed">
            Initialize a direct connection with our core team. We provide support exclusively via email.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* PRIMARY CONTACT CHANNEL */}
          <div className="space-y-6">
            <div 
              onClick={handleEmailClick}
              className="group bg-white/[0.02] border border-violet-500/20 p-8 rounded-[2.5rem] relative overflow-hidden transition-all hover:bg-violet-500/[0.04] hover:border-violet-500/50 cursor-pointer"
            >
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-500">
                <Mail size={160} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-black rounded-2xl border border-white/5 text-violet-500 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
                    <Mail size={24} />
                  </div>
                  
                  {/* IMPROVED COPY BUTTON */}
                  <button 
                    onClick={copyToClipboard}
                    className={`p-3 border rounded-xl transition-all flex items-center gap-2 ${
                      copied 
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                      : "bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span className="text-[9px] font-mono uppercase tracking-widest">
                      {copied ? "Copied" : "Copy"}
                    </span>
                  </button>
                </div>

                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em] block mb-2">Initialize_Uplink</span>
                <h3 className="text-3xl font-black text-white mb-2 group-hover:text-violet-400 transition-colors">
                  {supportEmail}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                  Click the card to open your mail app. If it doesn't open, use the copy button and paste into Gmail.
                </p>
              </div>
            </div>

            <div className="pt-8 flex items-center gap-4 px-4 opacity-40 grayscale hover:grayscale-0 transition-all cursor-crosshair">
              <ShieldCheck size={20} className="text-emerald-500" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Secure_Server_Transmission_Active</span>
            </div>
          </div>

          {/* QUERY GUIDELINES */}
          <div className="space-y-8 bg-white/[0.01] border border-white/5 p-10 rounded-[3rem]">
            <div className="space-y-4 border-t border-white/5 pt-4">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Expected_Query_Types</span>
              
              <div className="grid gap-4">
                <div className="flex gap-4 items-start p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <RefreshCcw size={18} className="text-blue-500 mt-1" />
                  <div>
                    <h5 className="text-xs font-black uppercase text-zinc-300">Refund_Protocols</h5>
                    <p className="text-[11px] text-zinc-500 font-mono mt-1">Issues regarding failed transactions or cancellations.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <HelpCircle size={18} className="text-violet-500 mt-1" />
                  <div>
                    <h5 className="text-xs font-black uppercase text-zinc-300">Operational_Guidance</h5>
                    <p className="text-[11px] text-zinc-500 font-mono mt-1">General help or studio profile management.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-violet-500/5 border border-violet-500/10 p-4 rounded-xl">
               <p className="text-[10px] font-mono text-violet-400 leading-relaxed uppercase">
                  Note: Always include your <span className="text-white">Registered Gmail</span> and <span className="text-white">Booking ID</span>.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}