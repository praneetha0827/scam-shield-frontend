import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ScanInlineResult from "../components/ScanInlineResult";
import ScamScoreGauge from "../components/ScamScoreGauge";
import { SafetyRecommendation } from "../components/SidePanels";
import { analyzeEmail } from "../api/email";

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 14,
  fontFamily: "inherit",
  marginBottom: 14,
};

export default function EmailScanner() {
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    if (!subject.trim() && !body.trim()) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeEmail(senderEmail, subject, body);
      setResult(res.scan);
    } catch (err) {
      setError(err.response?.data?.message || "Could not analyze this email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active="Email Scanner" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>Email Scanner</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Paste an email's sender, subject and body to check for phishing.</p>
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 320px" }}>
          <div className="panel">
            <div className="panel-header">
              <h3>Scan Email</h3>
            </div>
            <form onSubmit={handleScan}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Sender Email</label>
              <input
                type="text"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g. security@paypa1-verify.com"
                style={inputStyle}
              />

              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Urgent: Verify your account now"
                style={inputStyle}
              />

              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Email Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Paste the full email body here..."
                rows={7}
                style={{ ...inputStyle, resize: "vertical" }}
              />

              <button type="submit" className="btn-primary" style={{ width: "auto", padding: "12px 28px" }} disabled={loading || (!subject.trim() && !body.trim())}>
                {loading ? "Analyzing..." : "🔍 Scan Email"}
              </button>
            </form>

            {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

            <ScanInlineResult result={result} />
          </div>

          <div>
            <div className="panel" style={{ marginBottom: 20 }}>
              <div className="panel-header">
                <h3>AI Scam Score Guide</h3>
              </div>
              <ScamScoreGauge score={result?.score ?? 0} />
              <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 10 }}>
                Scores closer to 100% indicate higher risk of being a scam.
              </p>
            </div>
            <SafetyRecommendation verdict={result?.verdict} />
          </div>
        </div>
      </main>
    </div>
  );
}
