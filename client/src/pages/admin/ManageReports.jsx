import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import AdminNavbar from "../../components/layout/AdminNavbar";
import { EyeOff, TriangleAlert } from "lucide-react";

export default function ManageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const response = await API.get(`/admin/reports?page=${page}&limit=${limit}`);
      const payload = response.data;
      const items = Array.isArray(payload) ? payload : (payload?.items || []);
      const prioritized = [...items].sort((a, b) => Number(b.isSensitive) - Number(a.isSensitive));
      setReports(prioritized);
      setHasNextPage(Array.isArray(payload) ? items.length === limit : Boolean(payload?.pagination?.hasNextPage));
    } catch (error) {
      console.error(error);
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
          <p>Loading...</p>
        ) : reports.length === 0 ? (
          <div className="card text-gray-500">No reports found.</div>
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

              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-500">
                  Reporter: {r.isAnonymous ? "Anonymous" : renderDisplayName(r.user)}
                </span>

                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    r.status === "PENDING"
                      ? "bg-yellow-500"
                      : r.status === "REVIEWED"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                >
                  {r.status}
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
                <option value="REVIEWED">Reviewed</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4">
              <button
                className="btn"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page}</span>
              <button
                className="btn"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!hasNextPage || loading}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
