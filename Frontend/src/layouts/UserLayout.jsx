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
  Globe, // Added for Support
  LifeBuoy // Added for Help context
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
            <div className="h-10 w-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Scissors size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter">
                BookMyCut
              </h2>
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                User_Interface
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
            end={true}
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

          {/* NEW: SUPPORT UPLINK */}
          <div className="pt-4 mt-4 border-t border-white/5">
            <SidebarLink
              to="/app/contact"
              icon={<Globe size={18} />}
              label="Support"
            />
          </div>
        </nav>

        {/* USER FOOTER */}
        <div className="p-6 mt-auto border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="h-10 w-10 rounded-full object-cover border border-white/10"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                  <UserIcon size={18} className="text-zinc-500" />
                </div>
              )}
              {/* Status Indicator */}
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-[#080808] rounded-full" />
            </div>

            {/* <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">
                {user?.name || "Client_User"}
              </p>
              <p className="text-[10px] text-zinc-500 truncate font-mono uppercase tracking-tighter">
                {user?.role || "System_Active"}
              </p>
            </div> */}

            <NavLink to="/app/account" className="text-zinc-600 hover:text-violet-400 transition-colors">
              <Settings size={16} />
            </NavLink>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* TOP BAR / BREADCRUMB (Optional but adds to the Terminal feel) */}
        {/* <header className="h-16 border-b border-white/5 px-8 flex items-center justify-end hidden lg:flex">
          <div className="flex items-center gap-6">
             <NavLink to="/app/contact" className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest">
               <LifeBuoy size={14} className="text-violet-500" /> Need_Help?
             </NavLink>
             <div className="h-4 w-px bg-white/10" />
             <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em]">Node: {location.pathname}</span>
          </div>
        </header> */}

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
        `flex items-center gap-3 px-4 py-3 rounded-2xl transition group relative ${
          isActive
            ? "bg-violet-600 text-white shadow-lg shadow-violet-900/20"
            : "text-zinc-500 hover:text-white hover:bg-white/5"
        }`
      }
    >
      <div className="transition-transform group-hover:scale-110 duration-300">
        {icon}
      </div>
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      
      {/* Active Indicator Glow */}
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          isActive 
            ? "absolute left-0 w-1 h-4 bg-white rounded-r-full" 
            : "hidden"
        } 
      />
    </NavLink>
  );
}