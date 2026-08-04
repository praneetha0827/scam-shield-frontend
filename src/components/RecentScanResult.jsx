import VerdictBadge from "./VerdictBadge";

function timeAgoOrDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function RecentScanResult({ scan }) {
  if (!scan) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h3>Recent Scan Result</h3>
        </div>
        <p style={{ color: "#9ca3af", padding: "24px 0" }}>No scans yet. Run a scan to see AI analysis here.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Recent Scan Result</h3>
        <a href="/history" className="panel-link">View all</a>
      </div>

      <div className="scan-result-top">
        <VerdictBadge verdict={scan.verdict} />
        <span className="scan-result-score">Scam Score: {scan.score}%</span>
      </div>

      <div className="scan-result-box">
        <p className="scan-result-input">"{scan.input}"</p>
        <div className="scan-result-meta">
          <span>💬 Type: {scan.type}</span>
          <span>🕐 {timeAgoOrDate(scan.createdAt)}</span>
        </div>
      </div>

      {scan.reasons?.length > 0 && (
        <div className="scan-analysis">
          <h4>AI Analysis</h4>
          <p style={{ color: "#4b5563", fontSize: 13, marginBottom: 6 }}>This message contains typical scam patterns:</p>
          <ul>
            {scan.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {scan.verdict !== "Safe" && (
        <div className={`scan-warning ${scan.verdict === "Dangerous" ? "danger" : "warn"}`}>
          {scan.verdict === "Dangerous" ? "⛔ This is a scam. Do not click the link!" : "⚠️ Proceed with caution."}
        </div>
      )}
    </div>
  );
}
