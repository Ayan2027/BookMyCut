import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function RoleGuard({ role }) {
  const { role: userRole, hydrated } = useSelector((s) => s.auth);

  if (!hydrated) return null;
  if (userRole !== role) return <Navigate to="/403" />;

  return <Outlet />;
}
