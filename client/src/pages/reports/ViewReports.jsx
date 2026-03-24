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
          <div key={r._id} className="border p-3 mb-3">
            <h3 className="font-bold">{r.title}</h3>
            <p>{r.description}</p>
            <p className="text-sm">Status: {r.status}</p>
          </div>
        ))}
      </div>
    </>
  );
}
