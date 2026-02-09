import { Routes, Route } from "react-router-dom";

/* Layouts */
import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import SalonLayout from "../layouts/SalonLayout";
import AdminLayout from "../layouts/AdminLayout";

/* Guards */
import AuthGuard from "../guards/AuthGuard";
import RoleGuard from "../guards/RoleGuard";

/* Smart Redirect */
import RoleRedirect from "./RoleRedirect";

/* Public Pages */
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";
import VerifyOtp from "../pages/public/VerifyOtp";
import Salons from "../pages/public/Salons";
import SalonDetails from "../pages/public/SalonDetails";
import Search from "../pages/public/Search";
import Nearby from "../pages/public/Nearby";

/* System Pages */
import Forbidden from "../pages/system/Forbidden";
import NotFound from "../pages/system/NotFound";

/* User Pages */
import UserDashboard from "../pages/user/Dashboard";
import UserBookings from "../pages/user/Bookings";

/* Salon Pages */
import SalonEntry from "../pages/salon/SalonEntry";
import SalonServices from "../pages/salon/Services";
import SalonBookings from "../pages/salon/Bookings";
import SalonSlots from "../pages/salon/Slots";


/* Admin Pages */
import AdminDashboard from "../pages/admin/Dashboard";
import AdminSalons from "../pages/admin/Salons";
import AdminPayments from "../pages/admin/Payments";

import SalonEntry from "../pages/salon/SalonEntry";
import Apply from "../pages/salon/Apply";
import ApplicationStatus from "../pages/salon/ApplicationStatus";
import Dashboard from "../pages/salon/Dashboard";




export default function AppRoutes() {
  return (
    <Routes>

      {/* SMART LANDING */}
      <Route path="/" element={<RoleRedirect />} />

      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/salons" element={<Salons />} />
        <Route path="/salons/search" element={<Search />} />
        <Route path="/salons/nearby" element={<Nearby />} />
        <Route path="/salons/:salonId" element={<SalonDetails />} />
      </Route>

      <Route path="/403" element={<Forbidden />} />

      {/* USER */}
      <Route element={<AuthGuard />}>
        <Route element={<RoleGuard role="USER" />}>
          <Route element={<UserLayout />}>
            <Route path="/app" element={<UserDashboard />} />
            <Route path="/app/bookings" element={<UserBookings />} />
          </Route>
        </Route>
      </Route>

      {/* SALON */}
      <Route element={<AuthGuard />}>
        <Route element={<RoleGuard role="SALON" />}>
          <Route element={<SalonLayout />}>
            <Route path="/salon" element={<SalonEntry />} />
            <Route path="/salon/services" element={<SalonServices />} />
            <Route path="/salon/bookings" element={<SalonBookings />} />
            <Route path="/salon/slots" element={<SalonSlots />} />
          </Route>
        </Route>
      </Route>

      {/* ADMIN */}
      <Route element={<AuthGuard />}>
        <Route element={<RoleGuard role="ADMIN" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/salons" element={<AdminSalons />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
          </Route>
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<NotFound />} />

      <Route path="/salon" element={<SalonEntry />} />
      <Route path="/salon/apply" element={<Apply />} />
      <Route path="/salon/application-status" element={<ApplicationStatus />} />
      <Route path="/salon/dashboard" element={<Dashboard />} />


    </Routes>
  );
}
