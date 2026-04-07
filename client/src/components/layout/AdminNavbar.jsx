import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { performLogout } from "../../utils/logout";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const isActivePath = (path) => location.pathname === path;

  const navButtonClass = (active = false) =>
    [
      "relative rounded-xl px-3 py-2 font-medium transition-all duration-200 hover:-translate-y-px hover:bg-neutral-100 hover:text-primary-600 dark:hover:bg-neutral-800 dark:hover:text-primary-100",
      active
        ? "bg-primary-50 text-primary-700 ring-1 ring-primary-200 dark:bg-primary-900/30 dark:text-primary-100 dark:ring-primary-700/40"
        : "text-neutral-700 dark:text-neutral-200"
    ].join(" ");

  useEffect(() => {
    fetchUnreadCount();

    const intervalId = setInterval(fetchUnreadCount, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await API.get("/notifications");
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      // Keep navbar resilient even if notifications API fails.
      setUnreadCount(0);
    }
  };

  return (
    <div className="bg-white/95 dark:bg-neutral-900/95 shadow-sm ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 px-4 sm:px-6 py-3 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center transition-colors">
      <h1 className="text-xl font-semibold text-primary-700 dark:text-primary-100 text-center sm:text-left">Admin Panel</h1>

      <div className="w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-end gap-3 text-sm text-neutral-700 dark:text-neutral-200">
        <button className={navButtonClass(isActivePath("/admin"))} onClick={() => navigate("/admin")}>Dashboard</button>
        <button className={navButtonClass(isActivePath("/admin/reports"))} onClick={() => navigate("/admin/reports")}>Reports</button>
        <button className={navButtonClass(isActivePath("/admin/users"))} onClick={() => navigate("/admin/users")}>Users</button>
        <button className={navButtonClass(isActivePath("/admin/articles"))} onClick={() => navigate("/admin/articles")}>Articles</button>
        <button className={navButtonClass(isActivePath("/admin/videos"))} onClick={() => navigate("/admin/videos")}>Videos</button>
        <button className={navButtonClass(isActivePath("/admin/memes"))} onClick={() => navigate("/admin/memes")}>Memes</button>
        <button className={navButtonClass(isActivePath("/admin/error-logs"))} onClick={() => navigate("/admin/error-logs")}>Error Logs</button>
        <button className={`${navButtonClass(isActivePath("/admin/notifications"))} relative`} onClick={() => navigate("/admin/notifications")}>
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 leading-none">
              {unreadCount}
            </span>
          )}
        </button>
        <button className="rounded-xl px-3 py-2 font-medium text-red-500 transition-all duration-200 hover:-translate-y-px hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10" onClick={() => performLogout(navigate)}>Logout</button>
      </div>
    </div>
  );
}
