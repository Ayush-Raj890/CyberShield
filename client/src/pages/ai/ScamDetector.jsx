import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/ui/Button";

export default function ScamDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/ai/predict", { text });
      setResult(data);

      const previousCount = Number(localStorage.getItem("aiChecksCount") || 0);
      localStorage.setItem("aiChecksCount", String(previousCount + 1));

      toast.success("Analysis complete");
    } catch (error) {
      toast.error("AI request failed");
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

          <Button onClick={analyze} className="w-full sm:w-auto" loading={loading}>
            Analyze
          </Button>
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
