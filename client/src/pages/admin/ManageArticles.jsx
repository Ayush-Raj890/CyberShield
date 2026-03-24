import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminNavbar from "../../components/layout/AdminNavbar";

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "GENERAL"
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data } = await API.get("/articles");
      setArticles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createArticle = async (e) => {
    e.preventDefault();

    try {
      await API.post("/articles", form);
      setForm({ title: "", content: "", category: "GENERAL" });
      fetchArticles();
    } catch (error) {
      console.error(error);
      alert("Failed to create article");
    }
  };

  const deleteArticle = async (id) => {
    try {
      await API.delete(`/admin/articles/${id}`);
      fetchArticles();
    } catch (error) {
      console.error(error);
      alert("Failed to delete article");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-6">
        <h2 className="text-xl mb-4">Manage Articles</h2>

        <form onSubmit={createArticle} className="mb-6">
          <input
            placeholder="Title"
            className="border p-2 w-full mb-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Content"
            className="border p-2 w-full mb-2"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <select
            className="border p-2 w-full mb-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="GENERAL">General</option>
            <option value="PHISHING">Phishing</option>
            <option value="SCAM">Scam</option>
            <option value="PRIVACY">Privacy</option>
          </select>
          <button className="bg-blue-500 text-white px-3 py-1">
            Add Article
          </button>
        </form>

        {articles.map((a) => (
          <div key={a._id} className="border p-3 mb-2">
            <h3>{a.title}</h3>
            <button
              onClick={() => deleteArticle(a._id)}
              className="bg-red-500 text-white px-2 py-1 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
