import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-black text-white p-3 flex justify-between">
      <h1 className="font-bold">Admin Panel</h1>

      <div className="space-x-4">
        <button onClick={() => navigate("/admin")}>Dashboard</button>
        <button onClick={() => navigate("/admin/reports")}>Reports</button>
        <button onClick={() => navigate("/admin/users")}>Users</button>
        <button onClick={() => navigate("/admin/articles")}>Articles</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
