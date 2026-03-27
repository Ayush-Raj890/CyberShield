import { Home, FileText, Shield, Book, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">CyberShield</h1>

      <div className="flex items-center gap-4 text-sm">
        {user && (
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 hover:text-indigo-500">
            <Home size={16} /> Dashboard
          </button>
        )}

        <button onClick={() => navigate("/reports")} className="flex items-center gap-1 hover:text-indigo-500">
          <FileText size={16} /> Reports
        </button>

        <button onClick={() => navigate("/ai")} className="flex items-center gap-1 hover:text-indigo-500">
          <Shield size={16} /> AI
        </button>

        <button onClick={() => navigate("/articles")} className="flex items-center gap-1 hover:text-indigo-500">
          <Book size={16} /> Learn
        </button>

        {user ? (
          <button onClick={logout} className="flex items-center gap-1 text-red-500">
            <LogOut size={16} /> Logout
          </button>
        ) : (
          <button onClick={() => navigate("/login")} className="flex items-center gap-1 text-indigo-600">
            <LogOut size={16} /> Login
          </button>
        )}
      </div>
    </div>
  );
}
