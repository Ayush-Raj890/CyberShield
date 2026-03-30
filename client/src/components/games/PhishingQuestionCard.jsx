export default function PhishingQuestionCard({
  question,
  index,
  total,
  feedback,
  onAnswer,
  onNext,
  score
}) {
  if (!question) return null;

  return (
    <div className="max-w-2xl mx-auto card">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold">Phishing Detector</h2>
        <p className="text-sm text-gray-500">Question {index + 1} / {total}</p>
      </div>

      <p className="text-sm text-slate-500 mb-2">Score: {score}</p>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-5">
        <p className="text-slate-800">{question.text}</p>
      </div>

      {!feedback && (
        <div className="flex flex-wrap gap-3 justify-center">
          <button type="button" className="btn bg-emerald-600 hover:bg-emerald-700" onClick={() => onAnswer("SAFE")}>
            SAFE
          </button>
          <button type="button" className="btn btn-danger" onClick={() => onAnswer("SCAM")}>
            SCAM
          </button>
        </div>
      )}

      {feedback && (
        <div className="mt-5 text-center">
          <p className={feedback.correct ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}>
            {feedback.correct ? "Correct" : "Wrong"}
          </p>

          <p className="text-sm mt-2 text-slate-600">{feedback.explanation}</p>

          {feedback.correct && (
            <p className="text-emerald-600 text-xs mt-2">+XP and +Coins rewarded</p>
          )}

          <button type="button" className="btn btn-primary mt-4" onClick={onNext}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}
