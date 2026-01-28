import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthGuard() {
  const { token, hydrated } = useSelector((s) => s.auth);

  if (!hydrated) return null;
  if (!token) return <Navigate to="/login" />;

  return <Outlet />;
}
