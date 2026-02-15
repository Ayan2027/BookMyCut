import { Routes, Route } from "react-router-dom";

/* Layouts */
import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import SalonLayout from "../layouts/SalonLayout";
import AdminLayout from "../layouts/AdminLayout";

/* Guards */
import AuthGuard from "../guards/AuthGuard";
import RoleGuard from "../guards/RoleGuard";
import SalonApprovedGuard from "../guards/ApprovedSalonGuard";

/* Smart Redirect */
import RoleRedirect from "./RoleRedirect";

/* Public Pages */
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";
import VerifyOtp from "../pages/public/VerifyOtp";
import Salons from "../pages/public/Salons";
import SalonDetails from "../pages/public/SalonDetails";

/* System Pages */
import Forbidden from "../pages/system/Forbidden";
import NotFound from "../pages/system/NotFound";

/* User Pages */
import UserDashboard from "../pages/user/Dashboard";
import UserBookings from "../pages/user/Bookings";
// import BookFlow from "../pages/user/BookFlow";
// import BookingSuccess from "../pages/user/BookingSuccess";

/* Salon Pages */
import SalonServices from "../pages/salon/Services";
import SalonBookings from "../pages/salon/Bookings";
import SalonSlots from "../pages/salon/Slots";
import SalonEntry from "../pages/salon/SalonEntry";
import Dashboard from "../pages/salon/Dashboard";
import Wallet from "../pages/salon/Wallet";
import Profile from "../pages/salon/Profile";

/* Admin Pages */
import AdminDashboard from "../pages/admin/Dashboard";
import AdminSalons from "../pages/admin/Salons";
import AdminPayments from "../pages/admin/Payments";

export default function AppRoutes() {
  return (
    <Routes>
      {/* LANDING */}
      <Route path="/" element={<RoleRedirect />} />

      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/salons" element={<Salons />} />
        <Route path="/salons/:salonId" element={<SalonDetails />} />
      </Route>

      <Route path="/403" element={<Forbidden />} />

      {/* USER */}

      <Route element={<AuthGuard />}>
        <Route element={<RoleGuard role="USER" />}>
          <Route element={<UserLayout />}>
            <Route path="/app" element={<UserDashboard />} />
            <Route path="/app/bookings" element={<UserBookings />} />

            <Route path="/app/salons" element={<Salons />} />
            <Route path="/app/salons/:salonId" element={<SalonDetails />} />

            {/* NEW BOOK FLOW */}
            {/* <Route path="/app/salons/:salonId/book" element={<BookFlow />} />
            <Route path="/app/bookings/success" element={<BookingSuccess />} /> */}
          </Route>
        </Route>
      </Route>

      {/* SALON */}
      <Route element={<AuthGuard />}>
        <Route element={<RoleGuard role="SALON" />}>
          <Route element={<SalonLayout />}>
            <Route path="/salon" element={<SalonEntry />} />

            <Route element={<SalonApprovedGuard />}>
              <Route path="/salon/dashboard" element={<Dashboard />} />
              <Route path="/salon/services" element={<SalonServices />} />
              <Route path="/salon/bookings" element={<SalonBookings />} />
              <Route path="/salon/slots" element={<SalonSlots />} />
              <Route path="/salon/wallet" element={<Wallet />} />
              <Route path="/salon/profile" element={<Profile />} />
            </Route>
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
    </Routes>
  );
}
