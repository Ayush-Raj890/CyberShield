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
        <h2 className="text-xl mb-4">Create Report</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            className="w-full mb-3 p-2 border"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="w-full mb-3 p-2 border"
            onChange={handleChange}
          />

          <select
            name="category"
            className="w-full mb-3 p-2 border"
            onChange={handleChange}
          >
            <option value="SCAM">Scam</option>
            <option value="PHISHING">Phishing</option>
            <option value="HARASSMENT">Harassment</option>
            <option value="OTHER">Other</option>
          </select>

          <button className="w-full bg-blue-500 text-white p-2">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
