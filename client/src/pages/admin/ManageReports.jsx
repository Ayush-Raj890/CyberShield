import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import AdminNavbar from "../../components/layout/AdminNavbar";
import { EyeOff, TriangleAlert } from "lucide-react";
import Button from "../../components/ui/Button";
import PageState from "../../components/ui/PageState";
import {
  REPORT_STATUS_OPTIONS,
  getCategoryLabel,
  getStatusLabel,
  getSubcategoryLabel
} from "../../constants/reportTaxonomy";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "SUBMITTED":
    case "PENDING":
      return "bg-blue-500";
    case "UNDER_REVIEW":
    case "REVIEWED":
      return "bg-indigo-500";
    case "INVESTIGATING":
      return "bg-orange-500";
    case "NEED_MORE_INFO":
      return "bg-amber-500";
    case "RESOLVED":
      return "bg-green-500";
    case "CLOSED":
      return "bg-slate-700";
    case "DUPLICATE":
    case "FALSE_POSITIVE":
      return "bg-gray-500";
    case "ESCALATED":
      return "bg-red-600";
    case "SENSITIVE_HOLD":
      return "bg-pink-600";
    case "ARCHIVED":
      return "bg-zinc-600";
    default:
      return "bg-gray-500";
  }
};

export default function ManageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const limit = 10;

  const renderDisplayName = (person) => {
    if (!person) return "N/A";

    const baseName = person.name || person.email || "N/A";
    if (!person.alias) return baseName;

    return (
      <span title={`Username: ${baseName}`} className="cursor-help">
        {person.alias}
      </span>
    );
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await API.get(`/admin/reports?page=${page}&limit=${limit}`);
      const payload = response.data;
      const items = Array.isArray(payload) ? payload : (payload?.items || []);
      const prioritized = [...items].sort((a, b) => Number(b.isSensitive) - Number(a.isSensitive));
      setReports(prioritized);
      setHasNextPage(Array.isArray(payload) ? items.length === limit : Boolean(payload?.pagination?.hasNextPage));
    } catch (error) {
      console.error(error);
      setReports([]);
      setHasNextPage(false);
      setError(error.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!status) return;
    setUpdatingId(id);

    try {
      await API.put(`/reports/${id}`, { status });
      toast.success("Report status updated");
      fetchReports();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6">
        <h2 className="text-xl mb-4">All Reports</h2>

        {loading ? (
          <PageState
            variant="loading"
            title="Loading reports"
            description="Fetching the latest incident reports for moderation."
          />
        ) : error ? (
          <PageState
            variant="error"
            title="Reports unavailable"
            description={error}
            actionLabel="Try again"
            onAction={fetchReports}
          />
        ) : reports.length === 0 ? (
          <PageState
            variant="empty"
            title="No reports found"
            description="There are no reports for the current page yet."
          />
        ) : (
          <>
            {reports.map((r) => (
              <div
                key={r._id}
                className={`card mb-3 ${r.isSensitive ? "border-2 border-red-400 bg-red-50/40" : ""}`}
              >
              <h3 className="font-semibold text-lg">{r.title}</h3>
              <div className="flex flex-wrap gap-2 my-2">
                {r.isAnonymous && (
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 inline-flex items-center gap-1">
                    <EyeOff size={14} /> Anonymous
                  </span>
                )}
                {r.isSensitive && (
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 inline-flex items-center gap-1">
                    <TriangleAlert size={14} /> Sensitive
                  </span>
                )}
              </div>
              <p className="text-gray-600">{r.description}</p>

              <p className="text-sm mt-2 text-gray-500">
                {getCategoryLabel(r.category)} / {getSubcategoryLabel(r.subcategory || "SUSPICIOUS_OTHER")}
              </p>

              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-500">
                  Reporter: {r.isAnonymous ? "Anonymous" : renderDisplayName(r.user)}
                </span>

                <span
                  className={`px-2 py-1 rounded text-white text-xs ${getStatusBadgeClass(r.status)}`}
                >
                  {getStatusLabel(r.status)}
                </span>
              </div>

              {Array.isArray(r.history) && r.history.length > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  <p className="font-semibold mb-1">Status History</p>
                  {r.history.map((h, idx) => (
                    <p key={`${r._id}-history-${idx}`}>
                      {h.status} - {new Date(h.date).toLocaleString()}
                    </p>
                  ))}
                </div>
              )}

              <select
                onChange={(e) => updateStatus(r._id, e.target.value)}
                className="input mt-3"
                defaultValue=""
                disabled={updatingId === r._id}
              >
                <option value="">Update Status</option>
                {REPORT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1 || loading}>
                Previous
              </Button>
              <span className="text-sm text-gray-500">Page {page}</span>
              <Button variant="outline" onClick={() => setPage((prev) => prev + 1)} disabled={!hasNextPage || loading}>
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
