import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/auth/authThunks";

export default function Login() {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button disabled={loading}>Login</button>
    </form>
  );
}
