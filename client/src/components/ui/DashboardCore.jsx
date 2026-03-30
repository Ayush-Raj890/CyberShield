import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LazyCharts = React.lazy(() => import("../dashboard/Charts"));

const tabLabel = {
  overview: "Overview",
  analytics: "Analytics",
  reports: "Reports",
  moderation: "Moderation"
};

const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700"
};

const formatLabel = (value) =>
  value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());

export default function DashboardCore({ type, data }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const isDarkMode = false;

  const tabs = useMemo(
    () => (type === "admin" ? ["overview", "analytics", "moderation"] : ["overview", "analytics", "reports"]),
    [type]
  );

  useEffect(() => {
    if (activeTab === "analytics") {
      setChartsLoaded(true);
    }
  }, [activeTab]);

  const stats = data?.stats || {};
  const gamification = data?.gamification || {
    xp: 0,
    level: 1,
    streak: 0,
    badges: []
  };
  const progressPercent = Math.min(100, Number(gamification.xp || 0) % 100);

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 transition-colors ${
        isDarkMode ? "bg-slate-900 text-slate-100" : "bg-gradient-to-br from-gray-50 to-gray-100 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">
              {type === "admin" ? "Admin Dashboard" : "User Dashboard"}
            </h1>
            <p className={`${isDarkMode ? "text-slate-300" : "text-gray-500"} text-sm`}>
              {type === "admin" ? "System overview and moderation" : "Your activity and insights"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {type === "user" && (
              <button
                type="button"
                onClick={() => navigate("/create-report")}
                className="btn btn-primary"
              >
                Create Report
              </button>
            )}
            <button
              type="button"
              onClick={() => toast("UI implementation pending")}
              className="btn btn-primary"
              title="Global dark mode implementation pending"
            >
              Dark Mode (Soon)
            </button>
          </div>
        </div>

        <div className={`flex flex-wrap gap-4 mb-6 border-b ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : isDarkMode
                  ? "text-slate-300"
                  : "text-gray-500"
              }`}
            >
              {tabLabel[tab]}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="card text-center">
                <p className="text-sm text-gray-500 capitalize">{formatLabel(key)}</p>
                <h2 className="text-xl sm:text-2xl font-bold">{value}</h2>
              </div>
            ))}

            {type === "user" && (
              <>
                <div className="card col-span-2">
                  <h3 className="font-semibold mb-2">Your Progress</h3>

                  <p>Level {gamification.level}</p>
                  <p>XP: {gamification.xp}</p>
                  <p>🪙 Coins: {Number(gamification.coins || 0)}</p>
                  <p>🔥 Streak: {gamification.streak} day{gamification.streak === 1 ? "" : "s"}</p>
                  <p>Your best meme got {Number(stats.topMemeLikes || 0)} likes</p>
                  {Number(gamification.coins || 0) < 3 && (
                    <p className="text-red-500 text-xs mt-1">Low coins! Earn more by engaging.</p>
                  )}

                  <div className="w-full bg-gray-200 h-2 rounded mt-2">
                    <div
                      className="bg-indigo-500 h-2 rounded"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="card col-span-2">
                  <h3 className="font-semibold mb-2">Badges</h3>

                  {Array.isArray(gamification.badges) && gamification.badges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {gamification.badges.map((badge, index) => (
                        <span
                          key={`${badge.name}-${index}`}
                          className="px-3 py-1 bg-yellow-400 rounded text-sm"
                        >
                          {badge.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No badges earned yet.</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            {!chartsLoaded ? (
              <p className={isDarkMode ? "text-slate-300" : "text-gray-600"}>Loading analytics...</p>
            ) : (
              <Suspense fallback={<p className={isDarkMode ? "text-slate-300" : "text-gray-600"}>Loading charts...</p>}>
                <LazyCharts data={data} type={type} />
              </Suspense>
            )}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-3">
            {(data?.recentReports || []).length === 0 ? (
              <div className="card text-sm text-gray-500">No recent reports available.</div>
            ) : (
              data.recentReports.map((report) => (
                <div key={report._id} className="card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold break-words">{report.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor[report.status] || "bg-gray-100 text-gray-700"}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{report.category}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "moderation" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-semibold mb-3">Pending Reports</h3>
              {(data?.moderation?.pendingReports || []).length === 0 ? (
                <p className="text-sm text-gray-500">No pending reports.</p>
              ) : (
                <div className="space-y-2">
                  {data.moderation.pendingReports.map((report) => (
                    <div key={report._id} className="rounded border border-slate-200 px-3 py-2">
                      <p className="font-medium text-sm break-words">{report.title}</p>
                      <p className="text-xs text-gray-500">{report.category}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">Pending Articles</h3>
              {(data?.moderation?.pendingArticles || []).length === 0 ? (
                <p className="text-sm text-gray-500">No pending articles.</p>
              ) : (
                <div className="space-y-2">
                  {data.moderation.pendingArticles.map((article) => (
                    <div key={article._id} className="rounded border border-slate-200 px-3 py-2">
                      <p className="font-medium text-sm break-words">{article.title}</p>
                      <p className="text-xs text-gray-500">{article.category}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
