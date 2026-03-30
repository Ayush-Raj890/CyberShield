import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

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

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <h1 className="text-lg font-semibold text-blue-600 text-center sm:text-left">Admin Panel</h1>

      <div className="w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-end gap-3 text-sm">
        <button className="hover:text-blue-500" onClick={() => navigate("/admin")}>Dashboard</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/admin/reports")}>Reports</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/admin/users")}>Users</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/admin/articles")}>Articles</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/admin/videos")}>Videos</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/admin/memes")}>Memes</button>
        <button className="hover:text-blue-500" onClick={() => navigate("/admin/error-logs")}>Error Logs</button>
        <button className="hover:text-blue-500 relative" onClick={() => navigate("/admin/notifications")}>
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 leading-none">
              {unreadCount}
            </span>
          )}
        </button>
        <button className="hover:text-blue-500" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
