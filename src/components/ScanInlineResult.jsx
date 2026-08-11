import VerdictBadge from "./VerdictBadge";

export default function ScanInlineResult({ result }) {
  if (!result) return null;

  const reasons = result.reasons || [];
  const actions = result.recommendedActions || [];

  return (
    <div style={{ marginTop: 24, borderTop: "1px solid #f0f0f0", paddingTop: 20 }}>
      <div className="scan-result-top">
        <VerdictBadge verdict={result.verdict} />
        <span className="scan-result-score">Scam Score: {result.score}%</span>
      </div>

      <div className="scan-analysis">
        <h4>Risk Analysis</h4>
        {result.riskLevel && (
          <p style={{ color: "#4b5563", fontSize: 13, marginBottom: 6 }}>
            Risk Level: <strong>{result.riskLevel}</strong>
            {result.scamType ? <> | Scam Type: <strong>{result.scamType}</strong></> : null}
            {result.attackerIntent ? <> | Intent: <strong>{result.attackerIntent}</strong></> : null}
          </p>
        )}

        {reasons.length > 0 ? (
          <>
            <p style={{ color: "#4b5563", fontSize: 13, marginBottom: 6 }}>This item contains typical scam patterns:</p>
            <ul>
              {reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </>
        ) : (
          <p style={{ color: "#16a34a", fontSize: 14, fontWeight: 600 }}>No suspicious patterns detected.</p>
        )}

        {actions.length > 0 && (
          <>
            <h4 style={{ marginTop: 12 }}>Recommended Actions</h4>
            <ul>
              {actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {result.verdict !== "Safe" && (
        <div className={`scan-warning ${result.verdict === "Dangerous" ? "danger" : "warn"}`}>
          {result.verdict === "Dangerous" ? "This looks like a scam. Do not click links, reply, or pay." : "Proceed with caution and verify independently."}
        </div>
      )}
    </div>
  );
}
