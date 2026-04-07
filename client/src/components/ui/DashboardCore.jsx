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
  const dailyCap = 100;
  const dailyCoins = Number(gamification.dailyCoins || 0);
  const remainingDailyBudget = Math.max(0, dailyCap - dailyCoins);
  const nextUtcReset = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate() + 1,
      0,
      0,
      0
    )
  );
  const resetInMs = Math.max(0, nextUtcReset.getTime() - Date.now());
  const resetHours = Math.floor(resetInMs / (1000 * 60 * 60));
  const resetMinutes = Math.floor((resetInMs % (1000 * 60 * 60)) / (1000 * 60));
  const progressPercent = Math.min(100, Number(gamification.xp || 0) % 100);
  const statCardClass = "card hover:-translate-y-1";
  const sectionCardClass = "card hover:-translate-y-1";

  return (
    <div className="page-shell text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="container-page page-stack">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1>
              {type === "admin" ? "Admin Dashboard" : "User Dashboard"}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-300 text-sm sm:text-base mt-1">
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

        <div className="flex flex-wrap gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900/70 dark:ring-neutral-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-sm transition-colors ${
                activeTab === tab
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              }`}
            >
              {tabLabel[tab]}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="section-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className={`${statCardClass} text-center`}>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 capitalize">{formatLabel(key)}</p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">{value}</h2>
              </div>
            ))}

            {type === "user" && (
              <>
                <div className={`${sectionCardClass} sm:col-span-2`}>
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Progress</p>
                    <h3 className="mt-1 text-xl font-semibold">Your Progress</h3>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-sm text-neutral-700 dark:text-neutral-200">
                    <p className="rounded-xl bg-neutral-50 px-3 py-2 dark:bg-neutral-800">Level <span className="font-semibold text-neutral-900 dark:text-neutral-50">{gamification.level}</span></p>
                    <p className="rounded-xl bg-neutral-50 px-3 py-2 dark:bg-neutral-800">XP <span className="font-semibold text-neutral-900 dark:text-neutral-50">{gamification.xp}</span></p>
                    <p className="rounded-xl bg-neutral-50 px-3 py-2 dark:bg-neutral-800">🪙 Coins <span className="font-semibold text-neutral-900 dark:text-neutral-50">{Number(gamification.coins || 0)}</span></p>
                    <p className="rounded-xl bg-neutral-50 px-3 py-2 dark:bg-neutral-800">Daily Coins <span className="font-semibold text-neutral-900 dark:text-neutral-50">{dailyCoins}/{dailyCap}</span></p>
                    <p className="rounded-xl bg-neutral-50 px-3 py-2 dark:bg-neutral-800">🔥 Streak <span className="font-semibold text-neutral-900 dark:text-neutral-50">{gamification.streak} day{gamification.streak === 1 ? "" : "s"}</span></p>
                    <p className="rounded-xl bg-neutral-50 px-3 py-2 dark:bg-neutral-800">Best meme <span className="font-semibold text-neutral-900 dark:text-neutral-50">{Number(stats.topMemeLikes || 0)} likes</span></p>
                  </div>

                  <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800">
                    <p className="font-medium text-neutral-700 dark:text-neutral-200">Wallet Snapshot</p>
                    <p className="mt-1">Remaining daily earn budget: {remainingDailyBudget}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Next reset in ~{resetHours}h {resetMinutes}m (UTC)</p>
                  </div>
                  {Number(gamification.coins || 0) < 3 && (
                    <p className="text-red-500 text-xs mt-2">Low coins! Earn more by engaging.</p>
                  )}
                  {dailyCoins >= dailyCap && (
                    <p className="text-amber-600 text-xs mt-2">Daily coin cap reached. Rewards reset tomorrow.</p>
                  )}

                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-xl mt-4">
                    <div
                      className="bg-primary-600 h-2 rounded-xl"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className={`${sectionCardClass} sm:col-span-2`}>
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Recognition</p>
                    <h3 className="mt-1 text-xl font-semibold">Badges</h3>
                  </div>

                  {Array.isArray(gamification.badges) && gamification.badges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {gamification.badges.map((badge, index) => (
                        <span
                          key={`${badge.name}-${index}`}
                          className="px-3 py-1 bg-yellow-400 rounded-xl text-sm"
                        >
                          {badge.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-300">No badges earned yet.</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            {!chartsLoaded ? (
              <p className="text-neutral-500 dark:text-neutral-300">Loading analytics...</p>
            ) : (
              <Suspense fallback={<p className="text-neutral-500 dark:text-neutral-300">Loading charts...</p>}>
                <LazyCharts data={data} type={type} />
              </Suspense>
            )}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4">
            {(data?.recentReports || []).length === 0 ? (
              <div className="card hover:-translate-y-1 text-sm text-neutral-500 dark:text-neutral-300">No recent reports available.</div>
            ) : (
              data.recentReports.map((report) => (
                <div key={report._id} className="card hover:-translate-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold break-words">{report.title}</h3>
                    <span className={`px-2 py-1 rounded-xl text-xs font-semibold ${statusColor[report.status] || "bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100"}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-300 mt-1">{report.category}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "moderation" && (
          <div className="section-grid grid-cols-1 lg:grid-cols-2">
            <div className="card hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4">Pending Reports</h3>
              {(data?.moderation?.pendingReports || []).length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-300">No pending reports.</p>
              ) : (
                <div className="space-y-2">
                  {data.moderation.pendingReports.map((report) => (
                    <div key={report._id} className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-3 py-2">
                      <p className="font-medium text-sm break-words">{report.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-300">{report.category}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4">Pending Articles</h3>
              {(data?.moderation?.pendingArticles || []).length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-300">No pending articles.</p>
              ) : (
                <div className="space-y-2">
                  {data.moderation.pendingArticles.map((article) => (
                    <div key={article._id} className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-3 py-2">
                      <p className="font-medium text-sm break-words">{article.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-300">{article.category}</p>
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
