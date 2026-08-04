import VerdictBadge from "./VerdictBadge";

export default function ScanInlineResult({ result }) {
  if (!result) return null;

  return (
    <div style={{ marginTop: 24, borderTop: "1px solid #f0f0f0", paddingTop: 20 }}>
      <div className="scan-result-top">
        <VerdictBadge verdict={result.verdict} />
        <span className="scan-result-score">Scam Score: {result.score}%</span>
      </div>

      {result.reasons.length > 0 ? (
        <div className="scan-analysis">
          <h4>AI Analysis</h4>
          <p style={{ color: "#4b5563", fontSize: 13, marginBottom: 6 }}>This item contains typical scam patterns:</p>
          <ul>
            {result.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ color: "#16a34a", fontSize: 14, fontWeight: 600 }}>✅ No suspicious patterns detected.</p>
      )}

      {result.verdict !== "Safe" && (
        <div className={`scan-warning ${result.verdict === "Dangerous" ? "danger" : "warn"}`}>
          {result.verdict === "Dangerous" ? "⛔ This looks like a scam. Do not click any links or reply!" : "⚠️ Proceed with caution."}
        </div>
      )}
    </div>
  );
}
