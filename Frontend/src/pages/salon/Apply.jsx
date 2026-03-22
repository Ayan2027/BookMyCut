import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { applySalon } from "../../redux/salon/salonThunks";
import { logout } from "../../redux/auth/authThunks"; // Added for logout
import api from "../../services/api";
import { MapPin, Phone, Store, Image as ImageIcon, Sparkles, Globe, LogOut } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Apply() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    mapLink: "",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Logout Handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logged out successfully");
  };

  // image upload
  const uploadImage = async (file) => {
    if (!file) return;
    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);
      const res = await api.post("/upload", data);
      setImageUrl(res.data.url);
      toast.success("Identity asset uploaded.");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed. Try a smaller image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Validations
  const isValidMapLink = (url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname;
      return host.includes("google.com") || host.includes("goo.gl");
    } catch {
      return false;
    }
  };

  const isValidPhone = (phone) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidMapLink(form.mapLink)) {
      toast.error("Invalid Geo_Coordinates. Use a Google Maps link.");
      return;
    }

    if (!isValidPhone(form.phone)) {
      toast.error("Invalid Contact_Protocol. 10 digits required.");
      return;
    }

    if (!imageUrl) {
      toast.error("Visual_Identity (image) is required.");
      return;
    }

    try {
      const resultAction = await dispatch(
        applySalon({
          ...form,
          image: imageUrl,
        })
      );

      if (applySalon.fulfilled.match(resultAction)) {
        toast.success("Application transmitted successfully.");
      } else {
        toast.error("Protocol failed. Check your data.");
      }
    } catch (err) {
      toast.error("Network synchronization error.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 p-6 lg:p-12 selection:bg-violet-500/30 relative">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '12px',
            fontFamily: 'monospace'
          }
        }} 
      />

      {/* COOL LOGOUT TRIGGER */}
      <div className="fixed top-6 right-6 lg:top-12 lg:right-12 z-50">
        <button 
          onClick={handleLogout}
          className="group flex items-center gap-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 px-5 py-2.5 rounded-full transition-all duration-300 backdrop-blur-md"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-hover:text-red-400 transition-colors">LogOut</span>
          <LogOut size={16} className="text-zinc-500 group-hover:text-red-400" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-violet-500 font-mono text-[10px] tracking-[0.4em] uppercase">
            <Sparkles size={14} /> Partner_Registration
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Apply_ <br/>
            <span className="text-zinc-900 outline-text text-white/10">Studio</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Store size={120} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Salon Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest ml-1">Studio_Name</label>
              <input
                required
                placeholder="TRIM_BHAI_HQ"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-violet-500 transition-all font-mono text-sm"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest ml-1">Contact_Protocol</label>
              <div className="relative">
                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  required
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-violet-500 transition-all font-mono text-sm text-emerald-500"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest ml-1">Studio_Manifesto</label>
            <textarea
              required
              placeholder="Tell us about your aesthetic..."
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-violet-500 transition-all font-mono text-sm min-h-[100px]"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest ml-1">Sector_Address</label>
              <input
                required
                placeholder="Plot 404, Cyber Street"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-violet-500 transition-all font-mono text-sm"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest ml-1">City_Node</label>
              <input
                required
                placeholder="New Delhi"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-violet-500 transition-all font-mono text-sm"
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
          </div>

          {/* Map Link */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest ml-1 flex justify-between">
              Geo_Coordinates
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-violet-500 lowercase hover:underline flex items-center gap-1">
                <Globe size={10} /> source_map
              </a>
            </label>
            <input
              required
              placeholder="https://goo.gl/maps/..."
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-violet-500 transition-all font-mono text-xs text-blue-400"
              onChange={(e) => setForm({ ...form, mapLink: e.target.value })}
            />
          </div>

          {/* Image Picker */}
          <div className="space-y-4">
            <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest ml-1">Visual_Identity</label>
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <div className="flex-1 space-y-2">
                <p className="text-xs text-zinc-500 italic">Upload a high-fidelity image of your studio interior.</p>
                <input
                  type="file"
                  accept="image/*"
                  className="text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-white file:text-black hover:file:bg-violet-500 hover:file:text-white file:transition-all"
                  onChange={(e) => uploadImage(e.target.files[0])}
                />
              </div>

              {imageUrl ? (
                <div className="relative group">
                   <img src={imageUrl} alt="preview" className="w-32 h-32 object-cover rounded-2xl border border-white/10 shadow-2xl" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <ImageIcon size={20} />
                   </div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-800">
                   <ImageIcon size={30} />
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-violet-600 hover:text-white transition-all active:scale-95 disabled:opacity-20"
          >
            {isUploading ? "Uploading_Assets..." : "Submit_Application"}
          </button>
        </form>
      </div>
    </div>
  );
}