import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminNavbar from "../../components/layout/AdminNavbar";

const PAGE_SIZE = 20;

export default function ErrorLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("ALL");
  const [statusCode, setStatusCode] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [page, source, statusCode]);

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: PAGE_SIZE
      };

      if (source !== "ALL") {
        params.source = source;
      }

      if (statusCode.trim()) {
        params.statusCode = statusCode.trim();
      }

      const { data } = await API.get("/system/client-errors", { params });
      setLogs(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      setLogs([]);
      setTotalPages(1);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const term = search.toLowerCase();
    if (!term) return true;
    return (
      String(log.message || "").toLowerCase().includes(term) ||
      String(log.path || "").toLowerCase().includes(term) ||
      String(log.method || "").toLowerCase().includes(term)
    );
  });

  return (
    <>
      <AdminNavbar />

      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Client Error Logs</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
          <input
            type="text"
            className="input md:col-span-2"
            placeholder="Search message/path/method"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input"
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All sources</option>
            <option value="UI">UI</option>
            <option value="API">API</option>
          </select>

          <input
            type="number"
            className="input"
            placeholder="Status code"
            value={statusCode}
            onChange={(e) => {
              setStatusCode(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredLogs.length === 0 ? (
          <div className="card text-gray-500">No error logs found.</div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log._id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                      {log.source || "UNKNOWN"}
                    </span>
                    {log.statusCode && (
                      <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">
                        {log.statusCode}
                      </span>
                    )}
                    {log.method && (
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                        {log.method}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="font-semibold text-sm mb-1 break-words">{log.message}</p>
                {log.path && <p className="text-xs text-gray-500 mb-2">Path: {log.path}</p>}

                {(log.stack || log.componentStack) && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-600">View stack trace</summary>
                    <pre className="mt-2 whitespace-pre-wrap break-words bg-gray-50 p-3 rounded">
                      {log.stack || log.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            className="btn"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            type="button"
            className="btn"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
