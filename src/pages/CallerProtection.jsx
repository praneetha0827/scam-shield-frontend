import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ScanInlineResult from "../components/ScanInlineResult";
import ScamScoreGauge from "../components/ScamScoreGauge";
import { SafetyRecommendation } from "../components/SidePanels";
import { analyzeCaller } from "../api/caller";

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 14,
  fontFamily: "inherit",
  marginBottom: 14,
};

export default function CallerProtection() {
  const [callerNumber, setCallerNumber] = useState("");
  const [claimedOrganization, setClaimedOrganization] = useState("");
  const [context, setContext] = useState("");
  const [unknownCaller, setUnknownCaller] = useState(true);
  const [result, setResult] = useState(null);
  const [callerRisk, setCallerRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasInput = callerNumber.trim() || claimedOrganization.trim() || context.trim();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!hasInput) return;
    setError("");
    setLoading(true);
    setResult(null);
    setCallerRisk(null);

    try {
      const res = await analyzeCaller({
        callerNumber,
        claimedOrganization,
        context,
        unknownCaller,
      });
      setResult(res.scan);
      setCallerRisk(res.callerRisk);
    } catch (err) {
      setError(err.response?.data?.message || "Could not analyze this caller");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active="Caller Protection" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>Caller Protection</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Check suspicious callers for impersonation, OTP theft, payment fraud, and pressure tactics.
            </p>
          </div>
        </div>

        <div className="feature-banner">
          <div>
            <h2>Caller Impersonation Check</h2>
            <p>Turn suspicious call details into a clear warning before sharing OTPs, passwords, or payment information.</p>
          </div>
          <div className="feature-pill-row">
            <span className="feature-pill">Unknown Caller</span>
            <span className="feature-pill">Impersonation</span>
            <span className="feature-pill">OTP Safety</span>
          </div>
        </div>

        <div className="scanner-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Analyze Caller Risk</h3>
            </div>
            <form onSubmit={handleAnalyze}>
              <label className="field-label">Caller Number</label>
              <input value={callerNumber} onChange={(e) => setCallerNumber(e.target.value)} placeholder="e.g. Unknown, Private, +91 98765 43210" style={inputStyle} />

              <label className="field-label">Claimed Organization</label>
              <input value={claimedOrganization} onChange={(e) => setClaimedOrganization(e.target.value)} placeholder="e.g. SBI Bank, Income Tax, courier support" style={inputStyle} />

              <label className="field-label">What Did The Caller Say?</label>
              <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="Paste or type the caller's request, threat, payment demand, OTP request, or other suspicious context..." rows={7} style={{ ...inputStyle, resize: "vertical" }} />

              <label className="inline-check">
                <input type="checkbox" checked={unknownCaller} onChange={(e) => setUnknownCaller(e.target.checked)} />
                This is an unknown or unexpected caller
              </label>

              <button type="submit" className="btn-primary" style={{ width: "auto", padding: "12px 28px" }} disabled={loading || !hasInput}>
                {loading ? "Analyzing..." : "Analyze Caller"}
              </button>
            </form>

            {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

            {callerRisk && (
              <div className="summary-card">
                <h4>Caller Safety Summary</h4>
                <p>Recommended action: {callerRisk.recommendedAction}</p>
              </div>
            )}

            <ScanInlineResult result={result} />
          </div>

          <div>
            <div className="panel" style={{ marginBottom: 20 }}>
              <div className="panel-header">
                <h3>Caller Risk Guide</h3>
              </div>
              <ScamScoreGauge score={result?.score ?? 0} />
              <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 10 }}>
                Never share OTP, PIN, passwords, or banking details over calls.
              </p>
            </div>
            <SafetyRecommendation verdict={result?.verdict} />
          </div>
        </div>
      </main>
    </div>
  );
}
