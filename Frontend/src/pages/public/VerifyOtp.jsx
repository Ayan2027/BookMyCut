import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../redux/auth/authThunks";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, loading } = useSelector((s) => s.auth);

  const [otp, setOtp] = useState("");

  // Block page on refresh
  if (!location.state?.email) {
    return <Navigate to="/signup" replace />;
  }

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleVerify = async () => {
    const res = await dispatch(
      verifyOtp({ email: location.state.email, otp })
    );

    if (verifyOtp.fulfilled.match(res)) {
      toast.success("Signup successful");

      // redirect based on role
      if (res.payload.role === "SALON") {
        navigate("/salon");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div>
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}
