import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, adminOnly = false }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" />;

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
