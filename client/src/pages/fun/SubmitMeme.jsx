import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import API from "../../services/api";
import { syncUserCoins } from "../../utils/economySync";
import Button from "../../components/ui/Button";

export default function SubmitMeme() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("FUN");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please choose an image");
      return;
    }

    if (!caption.trim()) {
      toast.error("Caption is required");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption.trim());
      formData.append("category", category);

      await API.post("/memes", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      await syncUserCoins();

      setFile(null);
      setCaption("");
      setCategory("FUN");
      toast.success("Meme uploaded (+5 coins, -2 cost)");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload meme");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6">
        <form className="card max-w-md mx-auto" onSubmit={submit}>
          <h2 className="mb-4 text-lg font-semibold">Upload Meme</h2>

          <input
            type="file"
            accept="image/*"
            className="input mb-3"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <input
            className="input mb-3"
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <select className="input mb-4" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="FUN">Fun</option>
            <option value="AWARENESS">Awareness</option>
            <option value="SCAM">Scam</option>
          </select>

          <Button type="submit" className="w-full" loading={submitting}>
            Upload
          </Button>
        </form>
      </div>
    </>
  );
}