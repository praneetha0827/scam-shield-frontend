import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ScanInlineResult from "../components/ScanInlineResult";
import ScamScoreGauge from "../components/ScamScoreGauge";
import { SafetyRecommendation } from "../components/SidePanels";
import { analyzeWebsite } from "../api/website";

export default function WebsiteChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeWebsite(url);
      setResult(res.scan);
    } catch (err) {
      setError(err.response?.data?.message || "Could not analyze this website");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active="Website Checker" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>Website Checker</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Paste any URL to check for phishing or scam patterns.</p>
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 320px" }}>
          <div className="panel">
            <div className="panel-header">
              <h3>Check Website</h3>
            </div>
            <form onSubmit={handleScan} style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. www.freegiftcards.com or http://192.168.1.1/login"
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
              />
              <button type="submit" className="btn-primary" style={{ width: "auto", padding: "12px 24px" }} disabled={loading || !url.trim()}>
                {loading ? "Checking..." : "🔍 Check"}
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
