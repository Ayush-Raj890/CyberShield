import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/ui/Button";

export default function CreateReport() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "SCAM",
    severity: "LOW",
    contactEmail: "",
    evidence: null,
    isAnonymous: false,
    isSensitive: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: e.target.checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("severity", form.severity);
      if (form.contactEmail) formData.append("contactEmail", form.contactEmail);
      if (form.evidence) formData.append("evidence", form.evidence);
      formData.append("isAnonymous", String(form.isAnonymous));
      formData.append("isSensitive", String(form.isSensitive));

      await API.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Report submitted!");
      setForm({
        title: "",
        description: "",
        category: "SCAM",
        severity: "LOW",
        contactEmail: "",
        evidence: null,
        isAnonymous: false,
        isSensitive: false
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <form className="card" onSubmit={handleSubmit}>
          <h2 className="text-lg sm:text-xl mb-4 font-semibold">Create Report</h2>

          <input
            name="title"
            placeholder="Title"
            className="input"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            className="input"
            value={form.description}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            className="input"
            value={form.category}
            onChange={handleChange}
          >
            <option value="SCAM">Scam</option>
            <option value="PHISHING">Phishing</option>
            <option value="HARASSMENT">Harassment</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            name="severity"
            className="input"
            value={form.severity}
            onChange={handleChange}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email (optional)"
            className="input"
            value={form.contactEmail}
            onChange={handleChange}
          />

          <label className="flex items-center gap-2 mb-3 text-sm">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={form.isAnonymous}
              onChange={handleChange}
            />
            Submit Anonymously
          </label>

          <label className="flex items-center gap-2 mb-3 text-sm">
            <input
              type="checkbox"
              name="isSensitive"
              checked={form.isSensitive}
              onChange={handleChange}
            />
            Mark as Sensitive
          </label>

          <label className="block mb-3">
            <span className="text-sm font-semibold mb-2 block">Upload Evidence (optional)</span>
            <input
              type="file"
              name="evidence"
              className="input"
              onChange={handleChange}
              accept="image/*,.pdf"
            />
          </label>

          <Button type="submit" className="w-full" loading={loading}>
            Submit Report
          </Button>
        </form>
      </div>
    </>
  );
}
