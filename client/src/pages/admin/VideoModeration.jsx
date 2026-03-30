import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminNavbar from "../../components/layout/AdminNavbar";
import API from "../../services/api";

export default function VideoModeration() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchPendingVideos();
  }, []);

  const fetchPendingVideos = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/videos/pending");
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load pending videos");
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, status) => {
    setProcessing((prev) => ({ ...prev, [id]: true }));
    try {
      await API.put(`/videos/${id}`, { status });
      toast.success(`Video ${status.toLowerCase()}`);
      fetchPendingVideos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update video");
    } finally {
      setProcessing((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Video Moderation</h2>

        {loading ? (
          <p>Loading...</p>
        ) : videos.length === 0 ? (
          <div className="card text-gray-500">No pending videos.</div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video._id} className="card">
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.category}</p>
                {video.createdBy && (
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted by: {video.createdBy.alias || video.createdBy.name || video.createdBy.email}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className="btn btn-primary"
                    disabled={processing[video._id]}
                    onClick={() => update(video._id, "APPROVED")}
                  >
                    {processing[video._id] ? "Processing..." : "Approve"}
                  </button>

                  <button
                    className="btn btn-danger"
                    disabled={processing[video._id]}
                    onClick={() => update(video._id, "REJECTED")}
                  >
                    {processing[video._id] ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
