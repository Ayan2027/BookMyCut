import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function SalonApprovedGuard() {
  const { status } = useSelector((s) => s.salon);

  if (status !== "APPROVED") {
    return <Navigate to="/salon" replace />;
  }

  return <Outlet />;
}
