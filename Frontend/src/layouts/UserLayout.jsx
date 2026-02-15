import { Outlet, NavLink } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">TrimBhai</h2>

        <nav className="space-y-3">
          <NavLink to="/app" className="block">🏠 Home</NavLink>
          <NavLink to="/app/salons" className="block">🔍 Discover</NavLink>
          <NavLink to="/app/bookings" className="block">📦 Bookings</NavLink>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
