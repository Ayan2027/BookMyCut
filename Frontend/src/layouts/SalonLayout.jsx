import { Outlet, NavLink } from "react-router-dom";

export default function SalonLayout() {
  return (
    <div className="flex min-h-screen">
      
      <aside className="w-64 bg-indigo-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Salon Panel</h2>

        <nav className="space-y-3">
          <NavLink to="/salon/dashboard" className="block">📊 Dashboard</NavLink>
          <NavLink to="/salon/bookings" className="block">📦 Bookings</NavLink>
          <NavLink to="/salon/services" className="block">✂️ Services</NavLink>
          <NavLink to="/salon/slots" className="block">⏰ Slots</NavLink>
          <NavLink to="/salon/wallet" className="block">💰 Wallet</NavLink>
          <NavLink to="/salon/payout-history" className="block">🏦 Payouts</NavLink>
          <NavLink to="/salon/profile" className="block">⚙️ Settings</NavLink>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>

    </div>
  );
}
