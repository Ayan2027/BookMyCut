import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function RoleGuard({ allowed }) {
  const { role, hydrated } = useSelector((s) => s.auth);

  if (!hydrated) return null;
  if (!allowed.includes(role)) return <Navigate to="/403" />;

  return <Outlet />;
}
