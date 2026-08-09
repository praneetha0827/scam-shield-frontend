import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ScanInlineResult from "../components/ScanInlineResult";
import ScamScoreGauge from "../components/ScamScoreGauge";
import { SafetyRecommendation } from "../components/SidePanels";
import { analyzeWhatsApp } from "../api/whatsapp";

export default function WhatsAppAnalyzer() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeWhatsApp(message);
      setResult(res.scan);
    } catch (err) {
      setError(err.response?.data?.message || "Could not analyze this message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active="WhatsApp Analyzer" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>WhatsApp Analyzer</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Paste any WhatsApp message to check if it's a scam.
            </p>
          </div>
        </div>

        <div className="scanner-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Scan WhatsApp Message</h3>
            </div>
            <form onSubmit={handleScan}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Paste the WhatsApp message here, e.g. 'Hi, this is your bank. Your account will be blocked, click here to verify: http://bit.ly/xyz123'"
                rows={6}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                  fontFamily: "inherit",
                  resize: "vertical",
                  marginBottom: 14,
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "auto", padding: "12px 28px" }}
                disabled={loading || !message.trim()}
              >
                {loading ? "Analyzing..." : "🔍 Scan Message"}
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
