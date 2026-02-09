import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/auth/authThunks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // On successful login
  useEffect(() => {
    if (token) {
      toast.success("Login successful");
      navigate("/"); // change route if needed
    }
  }, [token, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <form onSubmit={submit}>
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

      <button disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
