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
  const [replyTo, setReplyTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [links, setLinks] = useState("");
  const [headers, setHeaders] = useState("");
  const [attachments, setAttachments] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasInput = [subject, body, links, headers, attachments].some((value) => value.trim());

  const handleScan = async (e) => {
    e.preventDefault();
    if (!hasInput) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeEmail({ senderEmail, replyTo, subject, body, links, headers, attachments });
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
            <p style={{ color: "#6b7280", fontSize: 14 }}>Check suspicious emails for phishing, spoofing, unsafe links, and risky attachments.</p>
          </div>
        </div>

        <div className="feature-banner">
          <div>
            <h2>Fake Mail Detection</h2>
            <p>Paste the visible email content plus technical clues like Reply-To, links, headers, or attachment names for a stronger result.</p>
          </div>
          <div className="feature-pill-row">
            <span className="feature-pill">Phishing</span>
            <span className="feature-pill">Spoofing</span>
            <span className="feature-pill">Unsafe Attachments</span>
          </div>
        </div>

        <div className="scanner-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Analyze Email Risk</h3>
            </div>
            <form onSubmit={handleScan}>
              <div className="form-grid-2">
                <div>
                  <label className="field-label">Sender Email</label>
                  <input
                    type="text"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="e.g. security@paypa1-verify.com"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="field-label">Reply-To Email</label>
                  <input
                    type="text"
                    value={replyTo}
                    onChange={(e) => setReplyTo(e.target.value)}
                    placeholder="e.g. claims@gmail.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              <label className="field-label">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Urgent: Verify your account now"
                style={inputStyle}
              />

              <label className="field-label">Email Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Paste the full email body here..."
                rows={7}
                style={{ ...inputStyle, resize: "vertical" }}
              />

              <label className="field-label">Links Found In Email</label>
              <textarea
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                placeholder="Paste suspicious links, one per line, if visible..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />

              <div className="form-grid-2">
                <div>
                  <label className="field-label">Header Clues</label>
                  <textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    placeholder="Optional: Authentication-Results, SPF, DKIM, DMARC..."
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
                <div>
                  <label className="field-label">Attachment Names</label>
                  <textarea
                    value={attachments}
                    onChange={(e) => setAttachments(e.target.value)}
                    placeholder="e.g. invoice.apk, prize.zip, statement.pdf"
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "auto", padding: "12px 28px" }} disabled={loading || !hasInput}>
                {loading ? "Analyzing..." : "Scan Email"}
              </button>
            </form>

            {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

            {result && (
              <div className="summary-card">
                <h4>Email Safety Summary</h4>
                <p>
                  {result.riskLevel || result.verdict} risk result for this email. Verify the sender outside the email before opening links,
                  attachments, or sharing account details.
                </p>
              </div>
            )}

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
