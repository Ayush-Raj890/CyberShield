import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminNavbar from "../../components/layout/AdminNavbar";
import Button from "../../components/ui/Button";
import PageState from "../../components/ui/PageState";

const PAGE_SIZE = 20;

export default function ErrorLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("ALL");
  const [statusCode, setStatusCode] = useState("");
  const [rangePreset, setRangePreset] = useState("ALL");
  const [errorTypePreset, setErrorTypePreset] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [page, source, statusCode, fromDate, toDate, rangePreset, errorTypePreset, search]);

  const fetchLogs = async () => {
    try {
      setError("");
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

      if (rangePreset !== "ALL") {
        params.range = rangePreset;
      }

      if (errorTypePreset !== "ALL") {
        params.type = errorTypePreset;
      }

      if (search.trim()) {
        params.q = search.trim();
      }

      if (fromDate) {
        params.fromDate = fromDate;
      }

      if (toDate) {
        params.toDate = toDate;
      }

      const { data } = await API.get("/system/client-errors", { params });
      setLogs(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      setLogs([]);
      setTotalPages(1);
      console.error(error);
      setError(error.response?.data?.message || "Failed to load client error logs");
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = async () => {
    try {
      setExporting(true);

      const params = {};

      if (source !== "ALL") {
        params.source = source;
      }

      if (statusCode.trim()) {
        params.statusCode = statusCode.trim();
      }

      if (rangePreset !== "ALL") {
        params.range = rangePreset;
      }

      if (errorTypePreset !== "ALL") {
        params.type = errorTypePreset;
      }

      if (search.trim()) {
        params.q = search.trim();
      }

      if (fromDate) {
        params.fromDate = fromDate;
      }

      if (toDate) {
        params.toDate = toDate;
      }

      const response = await API.get("/system/client-errors/export", {
        params,
        responseType: "blob"
      });

      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `client-error-logs-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Client Error Logs</h2>

        <div className="grid grid-cols-1 md:grid-cols-8 gap-3 mb-5">
          <input
            type="text"
            className="input md:col-span-2"
            placeholder="Search message/path/method"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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

          <select
            className="input"
            value={rangePreset}
            onChange={(e) => {
              setRangePreset(e.target.value);
              setFromDate("");
              setToDate("");
              setPage(1);
            }}
          >
            <option value="ALL">All time</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
          </select>

          <select
            className="input"
            value={errorTypePreset}
            onChange={(e) => {
              setErrorTypePreset(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All statuses</option>
            <option value="5xx">5xx only</option>
          </select>

          <input
            type="date"
            className="input"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setRangePreset("ALL");
              setPage(1);
            }}
          />

          <input
            type="date"
            className="input"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setRangePreset("ALL");
              setPage(1);
            }}
          />
        </div>

        <div className="flex justify-end mb-4">
          <Button
            type="button"
            onClick={exportCsv}
            disabled={exporting || loading}
            loading={exporting}
          >
            Export CSV
          </Button>
        </div>

        {loading ? (
          <PageState
            variant="loading"
            title="Loading error logs"
            description="Fetching client-side errors and stack traces."
          />
        ) : error ? (
          <PageState
            variant="error"
            title="Error logs unavailable"
            description={error}
            actionLabel="Try again"
            onAction={fetchLogs}
          />
        ) : logs.length === 0 ? (
          <PageState
            variant="empty"
            title="No error logs found"
            description="Adjust the filters or wait for new client errors to appear."
          />
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
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
          <Button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <Button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
