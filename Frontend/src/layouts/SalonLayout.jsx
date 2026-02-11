import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchMySalon } from "../redux/salon/salonThunks";

export default function SalonLayout() {
  const dispatch = useDispatch();
  const { role } = useSelector((s) => s.auth);

  useEffect(() => {
    if (role === "SALON") {
      dispatch(fetchMySalon());
    }
  }, [role, dispatch]);

  return (
    <div>
      {/* Sidebar / Navbar */}
      <Outlet />
    </div>
  );
}
