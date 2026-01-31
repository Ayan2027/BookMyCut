import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ApprovedSalonGuard() {
  const { status, hydrated } = useSelector((s) => s.salon || {});

  if (!hydrated) return null;
  if (status !== "APPROVED") return <Navigate to="/salon" />;

  return <Outlet />;
}
