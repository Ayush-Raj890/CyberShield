import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import MemeCard from "../../components/meme/MemeCard";
import API from "../../services/api";

export default function MemeHub() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");

  const fetchMemes = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/memes?sort=${sort}`);
      setMemes(Array.isArray(data) ? data : []);
    } catch (error) {
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

          <select className="input w-full sm:w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {loading ? (
          <p>Loading memes...</p>
        ) : memes.length === 0 ? (
          <div className="card text-gray-500">No memes yet. Be the first to post one.</div>
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