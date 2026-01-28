import { Routes, Route } from "react-router-dom";

function Login() {
  return <h2>Login Page</h2>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<h2>404</h2>} />
    </Routes>
  );
}
