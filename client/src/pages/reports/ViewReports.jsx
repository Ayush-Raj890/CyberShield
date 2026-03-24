import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/layout/Navbar";

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

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-xl mb-4">My Reports</h2>

        {reports.map((r) => (
          <div key={r._id} className="card mb-3">
            <h3 className="font-semibold text-lg">{r.title}</h3>
            <p className="text-gray-600">{r.description}</p>

            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">{r.category}</span>

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
          </div>
        ))}
      </div>
    </>
  );
}
