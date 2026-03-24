import { useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/layout/Navbar";

export default function CreateReport() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "SCAM"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/reports", form);
      alert("Report submitted successfully");
    } catch (error) {
      alert("Error submitting report");
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-md mx-auto">
        <form className="card" onSubmit={handleSubmit}>
          <h2 className="text-lg mb-4 font-semibold">Create Report</h2>

          <input
            name="title"
            placeholder="Title"
            className="input"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="input"
            onChange={handleChange}
          />

          <select
            name="category"
            className="input"
            onChange={handleChange}
          >
            <option value="SCAM">Scam</option>
            <option value="PHISHING">Phishing</option>
            <option value="HARASSMENT">Harassment</option>
            <option value="OTHER">Other</option>
          </select>

          <button className="btn btn-primary w-full">
            Submit Report
          </button>
        </form>
      </div>
    </>
  );
}
