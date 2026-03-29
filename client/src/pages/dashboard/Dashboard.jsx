import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardCore from "../../components/ui/DashboardCore";
import Navbar from "../../components/layout/Navbar";
import AdminNavbar from "../../components/layout/AdminNavbar";
import {
  getAdminDashboardData,
  getUserDashboardData
} from "../../services/dashboardService";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user?.role);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const adminData = await getAdminDashboardData();
        setData(adminData);
        return;
      }

      const userData = await getUserDashboardData(user?._id);
      setData(userData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        {isAdmin ? <AdminNavbar /> : <Navbar />}
        <div className="p-4 sm:p-6">Loading dashboard...</div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        {isAdmin ? <AdminNavbar /> : <Navbar />}
        <div className="p-4 sm:p-6 text-gray-500">Dashboard unavailable.</div>
      </>
    );
  }

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <Navbar />}
      <DashboardCore type={isAdmin ? "admin" : "user"} data={data} />
    </>
  );
}
