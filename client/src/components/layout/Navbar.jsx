import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user?.role);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-white shadow px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <h1 className="text-xl font-bold text-indigo-600 text-center sm:text-left">CyberShield</h1>

      <div className="w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 text-sm">
        <button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600">Dashboard</button>
        <button onClick={() => navigate("/ai")} className="hover:text-indigo-600">AI</button>

        <details className="relative">
          <summary className="cursor-pointer list-none hover:text-indigo-600">Activity</summary>
          <div className="absolute right-0 mt-2 w-36 rounded border bg-white shadow z-10">
            <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/reports")}>Reports</button>
            <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/forum")}>Forum</button>
          </div>
        </details>

        <details className="relative">
          <summary className="cursor-pointer list-none hover:text-indigo-600">Learn</summary>
          <div className="absolute right-0 mt-2 w-44 rounded border bg-white shadow z-10">
            <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/articles")}>Knowledge Hub</button>
            <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/videos")}>Video Hub</button>
            {user && (
              <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/videos/submit")}>Submit Video</button>
            )}
            <button className="block w-full text-left px-3 py-2 text-slate-400" disabled>Mini Games (Soon)</button>
          </div>
        </details>

        <details className="relative">
          <summary className="cursor-pointer list-none hover:text-indigo-600">Account</summary>
          <div className="absolute right-0 mt-2 w-36 rounded border bg-white shadow z-10">
            <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/profile")}>Profile</button>
            <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/settings")}>Settings</button>
          </div>
        </details>

        {isAdmin && (
          <details className="relative">
            <summary className="cursor-pointer list-none hover:text-indigo-600">Admin</summary>
            <div className="absolute right-0 mt-2 w-44 rounded border bg-white shadow z-10">
              <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/admin")}>Admin Dashboard</button>
              <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/admin/users")}>Manage Users</button>
              <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/admin/reports")}>Moderation</button>
              <button className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => navigate("/admin/videos")}>Video Moderation</button>
            </div>
          </details>
        )}

        {user ? (
          <button onClick={logout} className="text-red-500 hover:text-red-600">Logout</button>
        ) : (
          <button onClick={() => navigate("/login")} className="text-indigo-600 hover:text-indigo-700">Login</button>
        )}
      </div>
    </div>
  );
}
