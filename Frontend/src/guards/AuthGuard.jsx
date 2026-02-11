import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthGuard() {
  const { token } = useSelector((s) => s.auth);

  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
}
