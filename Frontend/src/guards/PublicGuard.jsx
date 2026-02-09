import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicGuard() {
  const { user, hydrated } = useSelector(s => s.auth);

  if (!hydrated) return <div>Checking session...</div>;

  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
