import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PublicLayout from "../../components/layout/PublicLayout";
import Button from "../../components/ui/Button";
import API from "../../services/api";

const verdictClasses = {
  DANGEROUS: "text-red-700",
  RISKY: "text-red-600",
  CAUTION: "text-amber-600",
  SAFE: "text-emerald-600",
  STRONG: "text-blue-700"
};

export default function TrustScanReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await API.get(`/trustscan/${id}`);
        setJob(payload.data.job);
        setReport(payload.data.report);
        setError("");
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load TrustScan report");
      }
    };

    load();
  }, [id]);

  const scoreStyle = useMemo(() => {
    const score = report?.score ?? 0;
    const safeScore = Math.max(0, Math.min(100, score));
    return {
      background: `conic-gradient(#2563eb ${safeScore * 3.6}deg, #e2e8f0 0deg)`
    };
  }, [report]);

  const sslFactor = report?.factors?.find((factor) => factor.key === "ssl") || null;
  const headersFactor = report?.factors?.find((factor) => factor.key === "headers") || null;
  const dnsFactor = report?.factors?.find((factor) => factor.key === "dns") || null;
  const reputationFactor = report?.factors?.find((factor) => factor.key === "reputation") || null;

  const shareReport = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Report link copied");
    } catch {
      toast.error("Unable to copy report link");
    }
  };

  return (
    <PublicLayout>
      <section className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-4xl card">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-700 font-semibold">TrustScan Report</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Final Assessment</h1>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!error && !report && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-700">
              <p className="font-semibold">Scan is not complete yet.</p>
              <p className="mt-1 text-sm">Open progress view to continue tracking checks.</p>
              <div className="mt-3">
                <Button onClick={() => navigate(`/trustscan/${id}`)}>Go to Progress</Button>
              </div>
            </div>
          )}

          {report && (
            <>
              <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <div className="mx-auto grid h-36 w-36 place-items-center rounded-full p-2" style={scoreStyle}>
                    <div className="grid h-full w-full place-items-center rounded-full bg-white text-3xl font-black text-slate-900">
                      {report.score}
                    </div>
                  </div>
                  <p className={`mt-4 text-sm font-bold ${verdictClasses[report.verdict] || "text-slate-700"}`}>
                    {report.verdict.replaceAll("_", " ")}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Target:</span> {report.url}</p>
                  <p className="mt-1 text-sm text-slate-600"><span className="font-semibold text-slate-800">Domain:</span> {report.normalizedDomain}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">Scanned:</span> {new Date(report.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-4 text-sm text-slate-700 leading-6">{report.summary}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-700 font-semibold">Transport Security</p>
                  <h2 className="mt-2 text-lg font-bold text-slate-900">SSL / TLS</h2>
                  <p className="mt-3 text-sm text-slate-700">
                    {sslFactor?.detail || "SSL factor unavailable."}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-700 font-semibold">Browser Protection Controls</p>
                  <h2 className="mt-2 text-lg font-bold text-slate-900">Security Headers</h2>

                  {headersFactor ? (
                    <>
                      <div className="mt-3 grid gap-2 text-sm">
                        {[
                          ["CSP", headersFactor.present?.includes("CSP")],
                          ["HSTS", headersFactor.present?.includes("HSTS")],
                          ["X-Frame-Options", headersFactor.present?.includes("XFO")],
                          ["Referrer-Policy", headersFactor.present?.includes("Referrer-Policy")],
                          ["X-Content-Type-Options", headersFactor.present?.includes("XCTO")],
                          ["Permissions-Policy", headersFactor.present?.includes("Permissions-Policy")]
                        ].map(([label, present]) => (
                          <div key={label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <span className="font-medium text-slate-800">{label}</span>
                            <span className={present ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>
                              {present ? "Present" : "Missing"}
                            </span>
                          </div>
                        ))}
                      </div>

                      <p className="mt-3 text-sm text-slate-700">
                        {headersFactor.detail}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">Security headers factor unavailable.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-bold text-slate-900">Factor Breakdown</h2>
                <div className="mt-4 space-y-3">
                  {(report.factors || []).map((factor) => (
                    <div key={factor.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{factor.label}</p>
                        <span className="text-sm font-semibold text-slate-700">Impact: {factor.impact > 0 ? `+${factor.impact}` : factor.impact}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">Status: {factor.status}</p>
                      <p className="mt-1 text-sm text-slate-600">{factor.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-bold text-slate-900">Additional Signals</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    { label: "DNS", factor: dnsFactor },
                    { label: "Reputation", factor: reputationFactor }
                  ].map(({ label, factor }) => (
                    <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">{label}</p>
                      <p className="mt-1 text-sm text-slate-600">{factor?.detail || "Coming soon."}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => navigate("/trustscan")}>Run Another Scan</Button>
                <Button variant="outline" onClick={shareReport}>Share Report</Button>
                <Button variant="secondary" onClick={() => navigate("/trustscan/history")}>View History</Button>
              </div>
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
