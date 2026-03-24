import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-blue-600">CyberShield</h1>

      <div className="space-x-4 text-sm">
        <button className="hover:text-blue-500" onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/create-report")}>Report</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/reports")}>My Reports</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/ai")}>AI</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/articles")}>Knowledge</button>
        <button className="hover:text-blue-500" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
