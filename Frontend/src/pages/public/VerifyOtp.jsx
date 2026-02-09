import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../redux/auth/authThunks";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleVerify = () => {
    dispatch(verifyOtp({ email: state.email, otp }));
  };

  return (
    <>
      <input
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
    </>
  );
}
