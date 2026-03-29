import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/api";
import Navbar from "../../components/layout/Navbar";

export default function Forum() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [replyingId, setReplyingId] = useState(null);

  const [postForm, setPostForm] = useState({ title: "", content: "" });
  const [replyDrafts, setReplyDrafts] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/forum");
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      setPosts([]);
      toast.error("Failed to load forum posts");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!user) {
      toast.error("Login required to create a post");
      navigate("/login");
      return;
    }

    if (!postForm.title.trim() || !postForm.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setCreating(true);
    try {
      await API.post("/forum", {
        title: postForm.title.trim(),
        content: postForm.content.trim()
      });
      setPostForm({ title: "", content: "" });
      toast.success("Post created");
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setCreating(false);
    }
  };

  const replyToPost = async (postId) => {
    if (!user) {
      toast.error("Login required to reply");
      navigate("/login");
      return;
    }

    const text = replyDrafts[postId]?.trim();
    if (!text) {
      toast.error("Reply cannot be empty");
      return;
    }

    setReplyingId(postId);
    try {
      await API.post(`/forum/${postId}/reply`, { text });
      setReplyDrafts((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Reply posted");
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post reply");
    } finally {
      setReplyingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-700 text-white p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Community Forum</h1>
          <p className="text-sm text-indigo-100 mb-3">
            Discuss active cyber threats, ask questions, and help others stay safe.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-white/20">View posts: Public</span>
            <span className="px-2 py-1 rounded bg-white/20">Create post: Login required</span>
            <span className="px-2 py-1 rounded bg-white/20">Reply: Login required</span>
          </div>

          <div className="mt-4">
            <button
              className="btn"
              onClick={() => (user ? navigate("/forum/create") : navigate("/login"))}
            >
              {user ? "Create Post" : "Login To Create Post"}
            </button>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="font-semibold text-lg mb-3">Create Post</h2>
          {!user && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-3">
              You are viewing as guest. Login to create a post.
            </p>
          )}

          <input
            className="input mb-3"
            placeholder="Post title"
            value={postForm.title}
            onChange={(e) => setPostForm((prev) => ({ ...prev, title: e.target.value }))}
            disabled={!user || creating}
          />

          <textarea
            className="input mb-3 min-h-28"
            placeholder="Share your experience, tips, or question"
            value={postForm.content}
            onChange={(e) => setPostForm((prev) => ({ ...prev, content: e.target.value }))}
            disabled={!user || creating}
          />

          <button className="btn btn-primary" onClick={createPost} disabled={!user || creating}>
            {creating ? "Publishing..." : "Create Post"}
          </button>
        </div>

        {loading ? (
          <p>Loading forum...</p>
        ) : posts.length === 0 ? (
          <div className="card text-gray-500">No posts yet. Start the first discussion.</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="card">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  By {post.user?.name || "Anonymous"} • {new Date(post.createdAt).toLocaleString()}
                </p>

                <p className="mt-3 text-sm leading-relaxed">{post.content}</p>

                <div className="mt-4 border-t pt-3">
                  <h4 className="font-medium text-sm mb-2">Replies ({post.replies?.length || 0})</h4>

                  {(post.replies || []).length === 0 ? (
                    <p className="text-xs text-gray-500">No replies yet.</p>
                  ) : (
                    <div className="space-y-2 mb-3">
                      {(post.replies || []).map((reply) => (
                        <div key={reply._id} className="rounded border bg-gray-50 px-3 py-2">
                          <p className="text-sm">{reply.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {reply.user?.name || "User"} • {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea
                    className="input mb-2 min-h-20"
                    placeholder={user ? "Write a reply..." : "Login to reply"}
                    value={replyDrafts[post._id] || ""}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [post._id]: e.target.value }))}
                    disabled={!user || replyingId === post._id}
                  />

                  <button
                    className="btn"
                    onClick={() => replyToPost(post._id)}
                    disabled={!user || replyingId === post._id}
                  >
                    {replyingId === post._id ? "Posting..." : "Reply"}
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
