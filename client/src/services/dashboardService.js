import API from "./api";

const DEFAULT_LIMIT = 50;

const isCurrentUserRecord = (recordUser, currentUserId) => {
  if (!recordUser || !currentUserId) return false;
  const id = typeof recordUser === "string" ? recordUser : recordUser._id;
  return String(id) === String(currentUserId);
};

export const transformUserDashboard = ({ profile, reports, articles, forumPosts, memes, currentUserId }) => {
  const ownReports = reports.filter((r) => isCurrentUserRecord(r.user, currentUserId));
  const ownArticles = articles.filter((a) => isCurrentUserRecord(a.createdBy, currentUserId));
  const ownPosts = forumPosts.filter((p) => isCurrentUserRecord(p.user, currentUserId));
  const ownMemes = memes.filter((m) => isCurrentUserRecord(m.createdBy, currentUserId));

  const pending = ownReports.filter((r) => r.status === "PENDING").length;
  const reviewed = ownReports.filter((r) => r.status === "REVIEWED").length;
  const resolved = ownReports.filter((r) => r.status === "RESOLVED").length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const reportsThisWeek = ownReports.filter((r) => new Date(r.createdAt) >= weekAgo).length;

  const aiChecks = Number(localStorage.getItem("aiChecksCount") || 0);
  const topMemeLikes = ownMemes.reduce((max, meme) => {
    const likes = Number(meme.upvotes?.length || 0);
    return likes > max ? likes : max;
  }, 0);

  return {
    stats: {
      reports: profile?.stats?.reports ?? ownReports.length,
      articles: profile?.stats?.articles ?? ownArticles.length,
      posts: profile?.stats?.posts ?? ownPosts.length,
      aiChecks,
      topMemeLikes,
      coins: profile?.user?.coins ?? 0,
      xp: profile?.user?.xp ?? 0,
      level: profile?.user?.level ?? 1
    },
    gamification: {
      xp: profile?.user?.xp ?? 0,
      level: profile?.user?.level ?? 1,
      streak: profile?.user?.streak ?? 0,
      coins: profile?.user?.coins ?? 0,
      dailyCoins: profile?.user?.dailyCoins ?? 0,
      badges: profile?.user?.badges ?? []
    },
    reportStatus: {
      pending,
      reviewed,
      resolved
    },
    analytics: {
      reportsThisWeek,
      aiUsageTrend: aiChecks > 0 ? "Active" : "No checks yet"
    },
    recentReports: (profile?.recentReports && profile.recentReports.length > 0)
      ? profile.recentReports
      : ownReports.slice(0, 6)
  };
};

export const transformAdminDashboard = ({ stats, reports, pendingArticles }) => {
  const byCategory = reports.reduce((acc, report) => {
    const key = report.category || "OTHER";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const bySeverity = reports.reduce((acc, report) => {
    const key = report.severity || "LOW";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const suspiciousCount = reports.filter((r) => r.isSensitive || r.category === "SCAM").length;

  return {
    stats: {
      users: stats?.totalUsers ?? 0,
      reports: stats?.totalReports ?? 0,
      pendingReports: stats?.pendingReports ?? 0,
      activeUsers: stats?.totalUsers ?? 0
    },
    analytics: {
      reportsByCategory: byCategory,
      reportsBySeverity: bySeverity,
      suspiciousActivityPatterns: suspiciousCount
    },
    moderation: {
      pendingReports: reports.filter((r) => r.status === "PENDING").slice(0, 6),
      pendingArticles: pendingArticles.slice(0, 6)
    },
    recentReports: reports.slice(0, 6)
  };
};

export const getUserDashboardData = async (currentUserId) => {
  const [profileRes, reportsRes, articlesRes, forumRes, memesRes] = await Promise.all([
    API.get("/users/profile"),
    API.get(`/reports/me?page=1&limit=${DEFAULT_LIMIT}`),
    API.get("/articles"),
    API.get("/forum"),
    API.get("/memes")
  ]);

  const reportsPayload = reportsRes.data;
  const reports = Array.isArray(reportsPayload) ? reportsPayload : (reportsPayload?.items || []);

  return transformUserDashboard({
    profile: profileRes.data,
    reports,
    articles: articlesRes.data || [],
    forumPosts: forumRes.data || [],
    memes: memesRes.data || [],
    currentUserId
  });
};

export const getAdminDashboardData = async () => {
  const [statsRes, reportsRes, pendingArticlesRes] = await Promise.all([
    API.get("/admin/stats"),
    API.get(`/admin/reports?page=1&limit=${DEFAULT_LIMIT}`),
    API.get("/articles/admin/pending")
  ]);

  const adminReportsPayload = reportsRes.data;
  const reports = Array.isArray(adminReportsPayload)
    ? adminReportsPayload
    : (adminReportsPayload?.items || []);

  return transformAdminDashboard({
    stats: statsRes.data,
    reports,
    pendingArticles: pendingArticlesRes.data || []
  });
};
