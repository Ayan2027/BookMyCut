import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      
      <aside className="w-64 bg-black text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <NavLink to="/admin" className="block">📊 Dashboard</NavLink>
          <NavLink to="/admin/salons" className="block">💈 Salons</NavLink>
          <NavLink to="/admin/bookings" className="block">📦 Bookings</NavLink>
          <NavLink to="/admin/payments" className="block">💳 Payments</NavLink>
          <NavLink to="/admin/payouts" className="block">🏦 Payouts</NavLink>
          <NavLink to="/admin/users" className="block">👥 Users</NavLink>
          <NavLink to="/admin/logs" className="block">📝 Logs</NavLink>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>

    </div>
  );
}
