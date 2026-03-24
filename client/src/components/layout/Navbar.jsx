import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-gray-800 text-white p-3 flex justify-between">
      <h1 className="font-bold">CyberShield</h1>

      <div className="space-x-4">
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/create-report")}>Report</button>
        <button onClick={() => navigate("/reports")}>My Reports</button>
        <button onClick={() => navigate("/ai")}>AI</button>
        <button onClick={() => navigate("/articles")}>Knowledge</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
