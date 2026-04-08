import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import MemeCard from "../../components/meme/MemeCard";
import API from "../../services/api";
import Button from "../../components/ui/Button";
import PageState from "../../components/ui/PageState";

export default function MemeHub() {
  const navigate = useNavigate();
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("latest");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchMemes = async () => {
    try {
      setError("");
      setLoading(true);
      const { data } = await API.get(`/memes?sort=${sort}`);
      setMemes(Array.isArray(data) ? data : []);
    } catch (error) {
      setMemes([]);
      setError(error.response?.data?.message || "Failed to load memes");
      toast.error("Failed to load memes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, [sort]);

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Meme Hub</h2>
            <p className="text-sm text-gray-500">Community memes with voting and moderation safeguards.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select className="input w-full sm:w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="trending">Trending</option>
            </select>
            <Button
              type="button"
              onClick={() => navigate(user ? "/memes/upload" : "/login")}
            >
              {user ? "Upload Meme" : "Login to Upload"}
            </Button>
          </div>
        </div>

        {loading ? (
          <PageState
            variant="loading"
            title="Loading memes"
            description="Fetching the latest community memes and engagement stats."
          />
        ) : error ? (
          <PageState
            variant="error"
            title="Meme feed unavailable"
            description={error}
            actionLabel="Try again"
            onAction={fetchMemes}
          />
        ) : memes.length === 0 ? (
          <PageState
            variant="empty"
            title="No memes yet"
            description="Be the first to post one or check back later for new submissions."
            actionLabel={user ? "Upload Meme" : "Login to Upload"}
            onAction={() => navigate(user ? "/memes/upload" : "/login")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {memes.map((meme) => (
              <MemeCard key={meme._id} meme={meme} refresh={fetchMemes} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}