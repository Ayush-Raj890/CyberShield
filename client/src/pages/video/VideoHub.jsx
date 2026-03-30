import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import API from "../../services/api";

const toEmbedUrl = (url) => {
  if (!url) return "";

  // YouTube watch links -> embed
  if (url.includes("youtube.com/watch")) {
    const params = new URL(url).searchParams;
    const id = params.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }

  // youtu.be links -> embed
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }

  return url;
};

export default function VideoHub() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/videos");
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Video Hub</h2>
            <p className="text-sm text-gray-500">Short-form awareness content approved by moderators</p>
          </div>
        </div>

        {loading ? (
          <p>Loading videos...</p>
        ) : videos.length === 0 ? (
          <div className="card text-gray-500">No approved videos yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {videos.map((video) => (
              <div key={video._id} className="card">
                <h3 className="font-semibold mb-2 break-words">{video.title}</h3>

                <iframe
                  className="w-full h-56 rounded"
                  src={toEmbedUrl(video.url)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                <p className="text-sm text-gray-500 mt-2">{video.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
