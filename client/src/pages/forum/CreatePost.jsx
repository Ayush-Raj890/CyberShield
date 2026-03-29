import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/api";
import Navbar from "../../components/layout/Navbar";

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      await API.post("/forum", {
        title: form.title.trim(),
        content: form.content.trim()
      });

      toast.success("Post created");
      navigate("/forum");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <form className="card" onSubmit={submit}>
          <h2 className="text-xl font-semibold mb-4">Create Community Post</h2>

          <input
            className="input mb-3"
            placeholder="Post title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />

          <textarea
            className="input min-h-40 mb-4"
            placeholder="Share your question, threat insight, or safety tip"
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          />

          <div className="flex gap-3">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish"}
            </button>
            <button className="btn" type="button" onClick={() => navigate("/forum")}>Back</button>
          </div>
        </form>
      </div>
    </>
  );
}
