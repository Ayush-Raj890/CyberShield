import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardCore from "../../components/ui/DashboardCore";
import Navbar from "../../components/layout/Navbar";
import AdminNavbar from "../../components/layout/AdminNavbar";
import PageState from "../../components/ui/PageState";
import Loader from "../../components/ui/Loader";
import {
  getAdminDashboardData,
  getUserDashboardData
} from "../../services/dashboardService";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user?.role);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setError("");
      setLoading(true);

      if (isAdmin) {
        const adminData = await getAdminDashboardData();
        setData(adminData);
        return;
      }

      const userData = await getUserDashboardData(user?._id);
      setData(userData);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load dashboard";
      setData(null);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        {isAdmin ? <AdminNavbar /> : <Navbar />}
        <div className="p-4 sm:p-6">
          <Loader label="Loading dashboard..." />
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        {isAdmin ? <AdminNavbar /> : <Navbar />}
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
          <PageState
            variant="error"
            title="Dashboard unavailable"
            description={error || "Something went wrong while loading dashboard data."}
            actionLabel="Try again"
            onAction={fetchDashboard}
          />
        </div>
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
