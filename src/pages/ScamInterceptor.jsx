import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ScanInlineResult from "../components/ScanInlineResult";
import ScamScoreGauge from "../components/ScamScoreGauge";
import { SafetyRecommendation } from "../components/SidePanels";
import { analyzeInterceptor } from "../api/interceptor";
import { recognize } from "tesseract.js";

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 14,
  fontFamily: "inherit",
  marginBottom: 14,
};

function EntityList({ entities }) {
  if (!entities) return null;
  const rows = [
    ["URLs", entities.urls],
    ["Emails", entities.emails],
    ["Phone Numbers", entities.phoneNumbers],
    ["UPI IDs", entities.upiIds],
    ["Amounts", entities.amounts],
    ["OTP References", entities.otpReferences],
  ].filter(([, values]) => values?.length);

  if (rows.length === 0) return null;

  return (
    <div className="scan-analysis" style={{ marginTop: 18 }}>
      <h4>Extracted Entities</h4>
      {rows.map(([label, values]) => (
        <p key={label} style={{ color: "#4b5563", fontSize: 13, marginBottom: 6 }}>
          <strong>{label}:</strong> {values.join(", ")}
        </p>
      ))}
    </div>
  );
}

export default function ScamInterceptor() {
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [notes, setNotes] = useState("");
  const [screenshotName, setScreenshotName] = useState("");
  const [screenshotText, setScreenshotText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrError, setOcrError] = useState("");
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasInput = message.trim() || url.trim() || email.trim() || phoneNumber.trim() || upiId.trim() || notes.trim() || screenshotText.trim();

  const handleScreenshot = async (file) => {
    setScreenshotName(file?.name || "");
    setScreenshotText("");
    setOcrError("");
    setOcrProgress(0);

    if (!file) return;

    setOcrLoading(true);
    try {
      const { data } = await recognize(file, "eng", {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setOcrProgress(Math.round((message.progress || 0) * 100));
          }
        },
      });
      setScreenshotText((data.text || "").trim());
      if (!data.text?.trim()) {
        setOcrError("No readable text was found in this screenshot. Try a clearer image or paste the text manually.");
      }
    } catch (err) {
      setOcrError("Could not extract text from this screenshot. Try a clearer image or paste the text manually.");
    } finally {
      setOcrLoading(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!hasInput) return;
    setError("");
    setLoading(true);
    setResult(null);
    setAnalysis(null);

    try {
      const res = await analyzeInterceptor({
        message,
        url,
        email,
        phoneNumber,
        upiId,
        notes: [
          notes,
          screenshotName ? `Screenshot provided: ${screenshotName}` : "",
          screenshotText ? `Screenshot OCR text: ${screenshotText}` : "",
        ].filter(Boolean).join("\n"),
      });
      setResult(res.scan);
      setAnalysis(res.analysis);
    } catch (err) {
      setError(err.response?.data?.message || "Could not analyze this scam context");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active="AI Scam Interceptor" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>AI Scam Interceptor</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Analyze suspicious text, links, phone numbers, email addresses, and UPI IDs in one place.
            </p>
          </div>
        </div>

        <div className="scanner-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Analyze Scam Context</h3>
            </div>
            <form onSubmit={handleAnalyze}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Suspicious Message Text</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Paste SMS, WhatsApp, email body, or copied text..." rows={6} style={{ ...inputStyle, resize: "vertical" }} />

              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Suspicious URL</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="e.g. http://bit.ly/claim-prize" style={inputStyle} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Email Address</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. support@paypa1-alert.com" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Phone Number</label>
                  <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g. +91 98765 43210" style={inputStyle} />
                </div>
              </div>

              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>UPI ID</label>
              <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="e.g. unknown@upi" style={inputStyle} />

              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Screenshot</label>
              <input type="file" accept="image/*" onChange={(e) => handleScreenshot(e.target.files?.[0])} style={inputStyle} />
              {screenshotName && (
                <p style={{ color: "#6b7280", fontSize: 12, marginTop: -8, marginBottom: 14 }}>
                  Screenshot selected: {screenshotName}
                </p>
              )}
              {ocrLoading && (
                <p style={{ color: "#6c4bf4", fontSize: 13, marginTop: -6, marginBottom: 14 }}>
                  Extracting screenshot text... {ocrProgress}%
                </p>
              )}
              {ocrError && <div className="error-banner" style={{ marginTop: -4 }}>{ocrError}</div>}
              {(screenshotText || screenshotName) && (
                <>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Extracted Screenshot Text</label>
                  <textarea
                    value={screenshotText}
                    onChange={(e) => setScreenshotText(e.target.value)}
                    placeholder="OCR text from the screenshot will appear here. You can edit it before analysis."
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </>
              )}

              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Extra Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any context: first-time recipient, caller claim, payment request, etc." rows={3} style={{ ...inputStyle, resize: "vertical" }} />

              <button type="submit" className="btn-primary" style={{ width: "auto", padding: "12px 28px" }} disabled={loading || ocrLoading || !hasInput}>
                {loading ? "Analyzing..." : "Analyze Risk"}
              </button>
            </form>

            {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}
            <EntityList entities={analysis?.entities || result?.entities} />
            <ScanInlineResult result={result} />
          </div>

          <div>
            <div className="panel" style={{ marginBottom: 20 }}>
              <div className="panel-header">
                <h3>Risk Score Guide</h3>
              </div>
              <ScamScoreGauge score={result?.score ?? 0} />
              <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 10 }}>
                The controlled risk engine combines rules, intent, and extracted entities.
              </p>
            </div>
            <SafetyRecommendation verdict={result?.verdict} />
          </div>
        </div>
      </main>
    </div>
  );
}
