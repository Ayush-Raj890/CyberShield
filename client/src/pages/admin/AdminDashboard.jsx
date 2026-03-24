import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminNavbar from "../../components/layout/AdminNavbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4">
          Users: {stats.totalUsers}
        </div>
        <div className="bg-green-100 p-4">
          Reports: {stats.totalReports}
        </div>
        <div className="bg-yellow-100 p-4">
          Pending: {stats.pendingReports}
        </div>
        <div className="bg-purple-100 p-4">
          Articles: {stats.totalArticles}
        </div>
      </div>
    </>
  );
}
