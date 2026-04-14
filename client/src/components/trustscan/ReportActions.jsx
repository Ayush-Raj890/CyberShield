import Button from "../ui/Button";

export default function ReportActions({ onRunAgain, onShare, onViewHistory }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Button onClick={onRunAgain}>Run Another Scan</Button>
      <Button variant="outline" onClick={onShare}>Share Report</Button>
      <Button variant="secondary" onClick={onViewHistory}>View History</Button>
    </div>
  );
}
