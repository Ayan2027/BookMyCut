import { Outlet, NavLink } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">TrimBhai</h2>

        <nav className="space-y-3">
          <NavLink to="/app" className="block">🏠 Home</NavLink>
          <NavLink to="/salons" className="block">🔍 Discover</NavLink>
          <NavLink to="/app/bookings" className="block">📦 Bookings</NavLink>
          <NavLink to="/app/favorites" className="block">❤️ Favorites</NavLink>
          <NavLink to="/app/offers" className="block">🎁 Offers</NavLink>
          <NavLink to="/support" className="block">🛟 Support</NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>

    </div>
  );
}
