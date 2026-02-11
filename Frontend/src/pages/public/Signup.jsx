import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestOtp } from "../../redux/auth/authThunks";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "USER"
  });

  // Redirect if already logged in
  if (token) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const submit = async () => {
    if (!form.email || !form.password) {
      toast.error("Email and password required");
      return;
    }

    const res = await dispatch(requestOtp(form));

    if (requestOtp.fulfilled.match(res)) {
      navigate("/verify-otp", { state: { email: form.email } });
    }
  };

  return (
    <>
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <select
        value={form.role}
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="USER">User</option>
        <option value="SALON">Salon</option>
      </select>

      <button onClick={submit} disabled={loading}>
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </>
  );
}
