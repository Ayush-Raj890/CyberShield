import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import { AlertCircle, Shield, Mail, Image as ImageIcon, EyeOff, TriangleAlert } from "lucide-react";
import Button from "../../components/ui/Button";
import PageState from "../../components/ui/PageState";
import {
  getCategoryLabel,
  getSourceChannelLabel,
  getStatusLabel,
  getSubcategoryLabel
} from "../../constants/reportTaxonomy";

const ASSET_HOST = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export default function ViewReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const limit = 10;

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    try {
      setError("");
      setLoading(true);
      const endpoint = user ? "/reports/me" : "/reports";
      const response = await API.get(`${endpoint}?page=${page}&limit=${limit}`);
      const payload = response.data;
      const items = Array.isArray(payload) ? payload : (payload?.items || []);
      const hasNext = Array.isArray(payload)
        ? items.length === limit
        : Boolean(payload?.pagination?.hasNextPage);

      setReports(items);
      setHasNextPage(hasNext);
    } catch (error) {
      console.error(error);
      setReports([]);
      setHasNextPage(false);
      setError(error.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "CRITICAL":
        return "bg-purple-100 text-purple-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
      case "PENDING":
        return "bg-blue-500";
      case "UNDER_REVIEW":
      case "REVIEWED":
        return "bg-blue-500";
      case "INVESTIGATING":
        return "bg-orange-500";
      case "NEED_MORE_INFO":
        return "bg-amber-500";
      case "RESOLVED":
        return "bg-green-500";
      case "CLOSED":
        return "bg-slate-700";
      case "DISMISSED":
      case "FALSE_POSITIVE":
      case "DUPLICATE":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">My Reports</h2>
          <Button type="button" className="w-full sm:w-auto" onClick={() => navigate(user ? "/create-report" : "/login") }>
            {user ? "Create Report" : "Login to Create Report"}
          </Button>
        </div>

        <input
          type="text"
          placeholder="Search reports by title"
          className="input mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <PageState
            variant="loading"
            title="Loading reports"
            description="Fetching the latest incident reports and evidence."
          />
        ) : error ? (
          <PageState
            variant="error"
            title="Reports unavailable"
            description={error}
            actionLabel="Try again"
            onAction={fetchReports}
          />
        ) : filteredReports.length === 0 ? (
          <PageState
            variant="empty"
            title={search ? "No matching reports" : "No reports yet"}
            description={search ? "Try a different title or clear the search box." : "Create your first report to start tracking incidents."}
            actionLabel={user ? "Create Report" : "Login to Create Report"}
            onAction={() => navigate(user ? "/create-report" : "/login")}
          />
        ) : (
          <>
            {filteredReports.map((r) => (
              <div key={r._id} className="card mb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <h3 className="font-semibold text-lg flex-1">{r.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs whitespace-nowrap self-start sm:ml-3 ${getStatusColor(
                    r.status
                  )}`}
                >
                  {getStatusLabel(r.status)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
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

              <p className="text-gray-600 mb-4">{r.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-gray-500" />
                  <span>Category: <strong>{getCategoryLabel(r.category)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-gray-500" />
                  <span>Subcategory: <strong>{getSubcategoryLabel(r.subcategory || "SUSPICIOUS_OTHER")}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-gray-500" />
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(r.severity)}`}>
                    {r.severity} Severity
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-gray-500" />
                  <span>Source: <strong>{getSourceChannelLabel(r.sourceChannel || "UNKNOWN")}</strong></span>
                </div>
                {r.contactEmail && (
                  <div className="flex items-center gap-2 col-span-2">
                    <Mail size={16} className="text-gray-500" />
                    <span>Contact: <strong>{r.contactEmail}</strong></span>
                  </div>
                )}
              </div>

              {r.evidence && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <ImageIcon size={16} /> Evidence
                  </p>
                  {r.evidence.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={`${ASSET_HOST}${r.evidence}`}
                      alt="Evidence"
                      className="w-full max-w-md rounded border"
                    />
                  ) : (
                    <a
                      href={`${ASSET_HOST}${r.evidence}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Evidence Document
                    </a>
                  )}
                </div>
              )}

              {Array.isArray(r.history) && r.history.length > 0 && (
                <div className="mt-4 text-xs text-gray-500">
                  <p className="font-semibold mb-1">Status History</p>
                  {r.history.map((h, idx) => (
                    <p key={`${r._id}-history-${idx}`}>
                      {h.status} - {new Date(h.date).toLocaleString()}
                    </p>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4">
                {new Date(r.createdAt).toLocaleDateString()} {new Date(r.createdAt).toLocaleTimeString()}
              </p>
              </div>
            ))}

            <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
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
