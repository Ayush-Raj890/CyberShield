import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, adminOnly = false }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
