import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-blue-600">Admin Panel</h1>

      <div className="space-x-4 text-sm">
        <button className="hover:text-blue-500" onClick={() => navigate("/admin")}>Dashboard</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/admin/reports")}>Reports</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/admin/users")}>Users</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/admin/articles")}>Articles</button>
        <button className="hover:text-blue-500" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
