import { Outlet, NavLink } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <NavLink to="/" className="font-bold text-xl">TrimBhai</NavLink>
        <nav className="space-x-4">
          <NavLink to="/salons">Browse</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Signup</NavLink>
          <NavLink to="/salon">Become a Partner</NavLink>
        </nav>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
}
