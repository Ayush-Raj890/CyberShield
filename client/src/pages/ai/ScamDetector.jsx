import { useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/layout/Navbar";

export default function ScamDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    try {
      const { data } = await API.post("/ai/predict", { text });
      setResult(data);
    } catch (error) {
      alert("AI request failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-xl mx-auto">
        <div className="card">
          <h2 className="text-xl mb-4">AI Scam Detector</h2>

          <textarea
            placeholder="Enter message or URL..."
            className="input"
            rows="4"
            onChange={(e) => setText(e.target.value)}
          />

          <button
            onClick={analyze}
            className="btn btn-primary"
          >
            Analyze
          </button>
        </div>

        {result && (
          <div
            className={`mt-4 p-4 rounded text-white ${
              result.label === "MALICIOUS"
                ? "bg-red-500"
                : "bg-green-500"
            }`}
          >
            <p className="font-semibold text-lg">{result.label}</p>
            <p>Confidence: {result.confidence}</p>
          </div>
        )}
      </div>
    </>
  );
}
