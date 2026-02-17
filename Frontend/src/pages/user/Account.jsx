import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Heart,
  Wallet,
  Bell,
  MapPin,
  Star,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { logout } from "../../redux/auth/authThunks";

export default function Account() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { label: "My Bookings", icon: Calendar, path: "/app/bookings" },
    { label: "Saved Salons", icon: Heart, path: "/app/favorites" },
    { label: "Payments & Wallet", icon: Wallet, path: "/app/payments" },
    { label: "Notifications", icon: Bell, path: "/app/notifications" },
    { label: "Saved Addresses", icon: MapPin, path: "/app/addresses" },
    { label: "My Reviews", icon: Star, path: "/app/reviews" },
    { label: "Help & Support", icon: HelpCircle, path: "/app/support" },
    { label: "Settings", icon: Settings, path: "/app/settings" }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 p-6 lg:p-12">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-black italic tracking-tight">
          ACCOUNT
        </h1>

        {/* PROFILE CARD */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex items-center gap-5">
          
          {/* Avatar */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-violet-600 flex items-center justify-center text-xl font-bold">
              {user?.name?.[0] || "U"}
            </div>
          )}

          {/* User Info */}
          <div className="flex-1">
            <p className="text-xl font-bold">
              {user?.name || "User"}
            </p>
            <p className="text-zinc-500 text-sm">
              {user?.phone || user?.email || "No contact info"}
            </p>
          </div>

          {/* Edit button */}
          <button
            onClick={() => navigate("/app/profile")}
            className="text-xs uppercase font-mono tracking-widest text-violet-400 hover:text-white transition-colors"
          >
            Edit
          </button>
        </div>

        {/* MENU LIST */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} className="text-violet-400" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-zinc-600" />
              </button>
            );
          })}
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl bg-red-600/10 border border-red-600/30 text-red-500 font-bold uppercase tracking-widest hover:bg-red-600/20 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
