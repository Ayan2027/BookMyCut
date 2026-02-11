import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function RoleGuard({ role }) {
  const { role: userRole } = useSelector((s) => s.auth);

  if (userRole !== role) return <Navigate to="/403" replace />;

  return <Outlet />;
}
