import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../../redux/auth/authThunks";

export default function VerifyOtp() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");

  return (
    <>
      <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={() => dispatch(verifyOtp({ email: state.email, otp }))}>
        Verify
      </button>
    </>
  );
}
