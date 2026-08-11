import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ScanInlineResult from "../components/ScanInlineResult";
import ScamScoreGauge from "../components/ScamScoreGauge";
import { SafetyRecommendation } from "../components/SidePanels";
import { assessUpiTransaction } from "../api/upi";

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 14,
  fontFamily: "inherit",
  marginBottom: 14,
};

export default function UpiGuardian() {
  const [upiId, setUpiId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [context, setContext] = useState("");
  const [firstTimeRecipient, setFirstTimeRecipient] = useState(true);
  const [result, setResult] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAssess = async (e) => {
    e.preventDefault();
    if (!upiId.trim() && !recipient.trim() && !amount && !context.trim()) return;
    setError("");
    setLoading(true);
    setResult(null);
    setAssessment(null);

    try {
      const res = await assessUpiTransaction({
        upiId,
        recipient,
        amount,
        context,
        firstTimeRecipient,
      });
      setResult(res.scan);
      setAssessment(res.assessment);
    } catch (err) {
      setError(err.response?.data?.message || "Could not assess this UPI transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active="UPI Guardian" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>UPI Transaction Guardian</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Check recipient, amount, and payment context before you send money.
            </p>
          </div>
        </div>

        <div className="scanner-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Pre-Transaction Risk Assessment</h3>
            </div>
            <form onSubmit={handleAssess}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>UPI ID</label>
              <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="e.g. unknown@upi" style={inputStyle} />

              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Recipient Name</label>
              <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. New seller or support agent" style={inputStyle} />

              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Amount</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 25000" style={inputStyle} />

              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Payment Context</label>
              <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="Paste the message or reason connected to this payment request..." rows={5} style={{ ...inputStyle, resize: "vertical" }} />

              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#374151", marginBottom: 14 }}>
                <input type="checkbox" checked={firstTimeRecipient} onChange={(e) => setFirstTimeRecipient(e.target.checked)} />
                First-time recipient
              </label>

              <button type="submit" className="btn-primary" style={{ width: "auto", padding: "12px 28px" }} disabled={loading || (!upiId.trim() && !recipient.trim() && !amount && !context.trim())}>
                {loading ? "Assessing..." : "Assess UPI Risk"}
              </button>
            </form>

            {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

            {assessment && (
              <div className="scan-analysis" style={{ marginTop: 22 }}>
                <h4>Guardian Summary</h4>
                <p style={{ color: "#4b5563", fontSize: 13, marginBottom: 6 }}>
                  Recipient risk: <strong>{assessment.recipientRisk}</strong>
                </p>
                <p style={{ color: "#4b5563", fontSize: 13 }}>Recommended action: {assessment.recommendedAction}</p>
              </div>
            )}

            <ScanInlineResult result={result} />
          </div>

          <div>
            <div className="panel" style={{ marginBottom: 20 }}>
              <div className="panel-header">
                <h3>Risk Score Guide</h3>
              </div>
              <ScamScoreGauge score={result?.score ?? 0} />
              <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 10 }}>
                75-100 is critical risk. Verify before proceeding with payment.
              </p>
            </div>
            <SafetyRecommendation verdict={result?.verdict} />
          </div>
        </div>
      </main>
    </div>
  );
}
