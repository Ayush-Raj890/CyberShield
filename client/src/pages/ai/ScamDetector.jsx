import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import Navbar from "../../components/layout/Navbar";

export default function ScamDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wakingHint, setWakingHint] = useState("");

  const analyze = async () => {
    setLoading(true);
    setWakingHint("");
    try {
      const { data } = await API.post("/ai/predict", { text });
      setResult(data);

      const previousCount = Number(localStorage.getItem("aiChecksCount") || 0);
      localStorage.setItem("aiChecksCount", String(previousCount + 1));

      toast.success("Analysis complete");
    } catch (error) {
      const message = error?.response?.data?.message || "AI request failed";
      toast.error(message);
      if (message.toLowerCase().includes("ai service failed")) {
        setWakingHint("Server waking up, please wait a few seconds and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-4 sm:p-6 max-w-xl mx-auto">
        <div className="card">
          <h2 className="text-lg sm:text-xl mb-4">AI Scam Detector</h2>

          <textarea
            placeholder="Enter message or URL..."
            className="input"
            rows="4"
            onChange={(e) => setText(e.target.value)}
          />

          <button
            onClick={analyze}
            className="btn btn-primary w-full sm:w-auto"
          >
            {loading ? "Processing..." : "Analyze"}
          </button>

          {wakingHint && (
            <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              {wakingHint}
            </p>
          )}
        </div>

        {result && (
          <div
            className={`mt-5 p-5 rounded-xl text-white shadow ${
              result.label === "MALICIOUS"
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : "bg-gradient-to-r from-green-500 to-green-600"
            }`}
          >
            <h3 className="text-xl font-bold">{result.label}</h3>
            <p className="opacity-90">Confidence: {result.confidence}</p>
          </div>
        )}
      </div>
    </>
  );
}
