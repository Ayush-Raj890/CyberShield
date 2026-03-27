import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import { AlertCircle, Shield, Mail, Image as ImageIcon, EyeOff, TriangleAlert } from "lucide-react";

export default function ViewReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await API.get("/reports");
      setReports(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "HIGH":
        return "bg-red-100 text-red-800";
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
      case "PENDING":
        return "bg-yellow-500";
      case "REVIEWED":
        return "bg-blue-500";
      case "RESOLVED":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl mb-6 font-semibold">My Reports</h2>

        {reports.length === 0 ? (
          <div className="card text-center text-gray-500 py-8">
            No reports submitted yet.
          </div>
        ) : (
          reports.map((r) => (
            <div key={r._id} className="card mb-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg flex-1">{r.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs whitespace-nowrap ml-3 ${getStatusColor(
                    r.status
                  )}`}
                >
                  {r.status}
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

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-gray-500" />
                  <span>Category: <strong>{r.category}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-gray-500" />
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(r.severity)}`}>
                    {r.severity} Severity
                  </span>
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
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${r.evidence}`}
                      alt="Evidence"
                      className="max-w-md rounded border"
                    />
                  ) : (
                    <a
                      href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${r.evidence}`}
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
          ))
        )}
      </div>
    </>
  );
}
