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

  const LoadingSkeleton = () => (
    <div className="page-shell">
      <div className="container-page page-stack animate-pulse">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="h-8 w-56 rounded-xl bg-neutral-200/70 dark:bg-neutral-700/70" />
            <div className="h-4 w-80 max-w-full rounded-xl bg-neutral-200/60 dark:bg-neutral-700/60" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 rounded-xl bg-neutral-200/70 dark:bg-neutral-700/70" />
            <div className="h-10 w-28 rounded-xl bg-neutral-200/70 dark:bg-neutral-700/70" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900/70 dark:ring-neutral-700">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-10 flex-1 min-w-[7rem] rounded-xl bg-neutral-200/70 dark:bg-neutral-700/70" />
          ))}
        </div>

        <div className="section-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card space-y-3">
              <div className="h-3 w-20 rounded-xl bg-neutral-200/70 dark:bg-neutral-700/70" />
              <div className="h-8 w-24 rounded-xl bg-neutral-200/80 dark:bg-neutral-700/80" />
            </div>
          ))}
        </div>

        <div className="section-grid grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="card space-y-3">
              <div className="h-4 w-32 rounded-xl bg-neutral-200/70 dark:bg-neutral-700/70" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded-xl bg-neutral-200/60 dark:bg-neutral-700/60" />
                <div className="h-3 w-5/6 rounded-xl bg-neutral-200/60 dark:bg-neutral-700/60" />
                <div className="h-3 w-2/3 rounded-xl bg-neutral-200/60 dark:bg-neutral-700/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
        <LoadingSkeleton />
      </>
    );
  }

  if (!data) {
    return (
      <>
        {isAdmin ? <AdminNavbar /> : <Navbar />}
        <div className="page-shell">
          <div className="container-page">
            <div className="card text-sm text-neutral-500 dark:text-neutral-300">Dashboard unavailable.</div>
          </div>
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
