const verdictClasses = {
  DANGEROUS: "text-red-700",
  RISKY: "text-red-600",
  CAUTION: "text-amber-600",
  SAFE: "text-emerald-600",
  STRONG: "text-blue-700"
};

export default function ScoreRing({ score = 0, verdict = "CAUTION" }) {
  const safeScore = Math.max(0, Math.min(100, score));
  const scoreStyle = {
    background: `conic-gradient(#2563eb ${safeScore * 3.6}deg, #e2e8f0 0deg)`
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
      <div className="mx-auto grid h-36 w-36 place-items-center rounded-full p-2" style={scoreStyle}>
        <div className="grid h-full w-full place-items-center rounded-full bg-white text-3xl font-black text-slate-900">
          {safeScore}
        </div>
      </div>
      <p className={`mt-4 text-sm font-bold ${verdictClasses[verdict] || "text-slate-700"}`}>
        {String(verdict).replaceAll("_", " ")}
      </p>
    </div>
  );
}
