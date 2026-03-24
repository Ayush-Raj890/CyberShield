import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminNavbar from "../../components/layout/AdminNavbar";

export default function ManageReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await API.get("/admin/reports");
      setReports(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    if (!status) return;

    try {
      await API.put(`/reports/${id}`, { status });
      fetchReports();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6">
        <h2 className="text-xl mb-4">All Reports</h2>

        {reports.map((r) => (
          <div key={r._id} className="border p-3 mb-3">
            <h3>{r.title}</h3>
            <p>{r.description}</p>
            <p>User: {r.user?.email}</p>
            <p>Status: {r.status}</p>

            <select
              onChange={(e) => updateStatus(r._id, e.target.value)}
              className="mt-2"
            >
              <option value="">Update Status</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        ))}
      </div>
    </>
  );
}
