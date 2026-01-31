import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleRedirect() {
  const { role, hydrated } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;

    if (role === "USER") navigate("/app", { replace: true });
    else if (role === "SALON") navigate("/salon", { replace: true });
    else if (role === "ADMIN") navigate("/admin", { replace: true });
    else navigate("/login", { replace: true });
  }, [role, hydrated]);

  return null;
}
