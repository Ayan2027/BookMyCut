import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestOtp } from "../../redux/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "USER"
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const submit = async () => {
    const res = await dispatch(requestOtp(form));

    // Navigate only if success
    if (requestOtp.fulfilled.match(res)) {
      navigate("/verify-otp", { state: { email: form.email } });
    }
  };

  return (
    <>
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="USER">User</option>
        <option value="SALON">Salon</option>
      </select>

      <button onClick={submit}>Send OTP</button>
    </>
  );
}
