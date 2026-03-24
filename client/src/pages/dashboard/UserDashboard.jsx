import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

export default function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl mb-4">
          Welcome, {user?.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card cursor-pointer hover:shadow-lg" onClick={() => navigate("/create-report")}>
            <h3 className="font-semibold">Create Report</h3>
            <p className="text-sm text-gray-500">Report suspicious activity</p>
          </div>

          <div className="card cursor-pointer hover:shadow-lg" onClick={() => navigate("/reports")}>
            <h3 className="font-semibold">View Reports</h3>
            <p className="text-sm text-gray-500">Track your reports</p>
          </div>

          <div className="card cursor-pointer hover:shadow-lg" onClick={() => navigate("/ai")}>
            <h3 className="font-semibold">AI Detector</h3>
            <p className="text-sm text-gray-500">Analyze messages</p>
          </div>

          <div className="card cursor-pointer hover:shadow-lg" onClick={() => navigate("/articles")}>
            <h3 className="font-semibold">Knowledge Hub</h3>
            <p className="text-sm text-gray-500">Learn cybersecurity</p>
          </div>
        </div>
      </div>
    </>
  );
}
