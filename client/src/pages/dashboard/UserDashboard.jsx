import { Shield, FileText, Brain, Book, Users } from "lucide-react";
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
          <div className="card flex items-center gap-4 cursor-pointer" onClick={() => navigate("/create-report")}>
            <Shield className="text-indigo-500" />
            <div>
              <h3 className="font-semibold">Create Report</h3>
              <p className="text-sm text-gray-500">Report threats instantly</p>
            </div>
          </div>

          <div className="card flex items-center gap-4 cursor-pointer" onClick={() => navigate("/reports")}>
            <FileText className="text-green-500" />
            <div>
              <h3 className="font-semibold">My Reports</h3>
              <p className="text-sm text-gray-500">Track status</p>
            </div>
          </div>

          <div className="card flex items-center gap-4 cursor-pointer" onClick={() => navigate("/ai")}>
            <Brain className="text-yellow-500" />
            <div>
              <h3 className="font-semibold">AI Detector</h3>
              <p className="text-sm text-gray-500">Analyze scams</p>
            </div>
          </div>

          <div className="card flex items-center gap-4 cursor-pointer" onClick={() => navigate("/articles")}>
            <Book className="text-purple-500" />
            <div>
              <h3 className="font-semibold">Knowledge Hub</h3>
              <p className="text-sm text-gray-500">Stay informed</p>
            </div>
          </div>

          <div className="card flex items-center gap-4 cursor-pointer" onClick={() => navigate("/forum")}>
            <Users className="text-blue-500" />
            <div>
              <h3 className="font-semibold">Community Forum</h3>
              <p className="text-sm text-gray-500">Discuss threats and solutions</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
