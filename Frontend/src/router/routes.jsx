import { Routes, Route } from "react-router-dom";
import Login from "../pages/public/Login";
import SignUp from "../pages/public/Signup"
import VerifyOtp from "../pages/public/VerifyOtp";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="*" element={<h2>404</h2>} />
    </Routes>
  );
}
