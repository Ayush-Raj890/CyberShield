import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import API from "../../services/api";
import Button from "../../components/ui/Button";

export default function SubmitVideo() {
  const [form, setForm] = useState({
    title: "",
    url: "",
    category: "AWARENESS"
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.url.trim()) {
      toast.error("Title and URL are required");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/videos", {
        title: form.title.trim(),
        url: form.url.trim(),
        category: form.category
      });

      toast.success("Submitted for review");
      setForm({ title: "", url: "", category: "AWARENESS" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit video");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6">
        <form className="card max-w-md mx-auto" onSubmit={submit}>
          <h2 className="mb-4 text-lg font-semibold">Submit Video</h2>

          <input
            className="input mb-3"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />

          <input
            className="input mb-3"
            placeholder="Embed URL"
            value={form.url}
            onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
          />

          <select
            className="input mb-4"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          >
            <option value="AWARENESS">Awareness</option>
            <option value="SCAM">Scam</option>
            <option value="TIPS">Tips</option>
          </select>

          <Button type="submit" className="w-full" loading={submitting}>
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}
