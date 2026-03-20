import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  Compass,
  Package,
  Scissors,
  User as UserIcon,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/auth/authThunks";
import { storage } from "../utils/storage";

export default function UserLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  // Close sidebar automatically when navigating on mobile
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Fetch profile only if token exists
  useEffect(() => {
    const token = storage.getToken();
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-100 overflow-hidden relative">
      
      {/* MOBILE HAMBURGER BUTTON */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-violet-600 rounded-xl shadow-lg text-white"
      >
        <Menu size={20} />
      </button>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-[70] w-72 border-r border-white/5 bg-[#080808] flex flex-col transition-transform duration-300
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* BRAND */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-violet-600 rounded-xl flex items-center justify-center">
              <Scissors size={30} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black italic">
                BookMyCut
              </h2>
              <span className="text-[9px] font-mono text-zinc-600 uppercase">
                User_Terminal
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-zinc-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarLink
            to="/app/salons"
            icon={<Compass size={18} />}
            label="Discover"
          />
          <SidebarLink
            to="/app/bookings"
            icon={<Package size={18} />}
            label="Bookings"
          />
          <SidebarLink
            to="/app/account"
            icon={<UserIcon size={18} />}
            label="Account"
          />
        </nav>

        {/* USER FOOTER */}
        <div className="p-6 mt-auto border-t border-white/5">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <UserIcon size={18} />
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">
                {user?.name || "Client_User"}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                {user?.phone || "System_Active"}
              </p>
            </div>

            <Settings size={16} className="text-zinc-500" />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
          isActive
            ? "bg-violet-600 text-white"
            : "text-zinc-500 hover:text-white hover:bg-white/5"
        }`
      }
    >
      {icon}
      <span className="text-xs font-bold uppercase">{label}</span>
    </NavLink>
  );
}
