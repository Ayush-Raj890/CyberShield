import { useMemo } from "react";

const renderStatRow = (label, value) => (
  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2" key={label}>
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm font-semibold text-slate-800">{value}</span>
  </div>
);

export default function Charts({ data, type }) {
  const analyticsRows = useMemo(() => {
    if (type === "admin") {
      const categoryRows = Object.entries(data?.analytics?.reportsByCategory || {}).map(([k, v]) =>
        renderStatRow(`Category: ${k}`, v)
      );
      const severityRows = Object.entries(data?.analytics?.reportsBySeverity || {}).map(([k, v]) =>
        renderStatRow(`Severity: ${k}`, v)
      );
      const suspicious = renderStatRow(
        "Suspicious Patterns",
        data?.analytics?.suspiciousActivityPatterns ?? 0
      );

      return [...categoryRows, ...severityRows, suspicious];
    }

    return [
      renderStatRow("Pending", data?.reportStatus?.pending ?? 0),
      renderStatRow("Reviewed", data?.reportStatus?.reviewed ?? 0),
      renderStatRow("Resolved", data?.reportStatus?.resolved ?? 0),
      renderStatRow("Reports This Week", data?.analytics?.reportsThisWeek ?? 0),
      renderStatRow("AI Usage Trend", data?.analytics?.aiUsageTrend || "No data")
    ];
  }, [data, type]);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Analytics Snapshot</h3>
      <p className="text-sm text-slate-500 mb-4">
        Lazy-loaded analytics module. Replace this with Recharts when chart visuals are needed.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{analyticsRows}</div>
    </div>
  );
}
