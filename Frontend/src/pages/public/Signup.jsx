import { useState } from "react";
import { useDispatch } from "react-redux";
import { requestOtp } from "../../redux/auth/authThunks";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "USER"
  });

  const submit = async () => {
    await dispatch(requestOtp(form));
    navigate("/verify-otp", { state: { email: form.email } });
  };

  return (
    <>
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="USER">User</option>
        <option value="SALON">Salon</option>
      </select>
      <button onClick={submit}>Send OTP</button>
    </>
  );
}
