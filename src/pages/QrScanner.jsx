import { useRef, useState } from "react";
import jsQR from "jsqr";
import Sidebar from "../components/Sidebar";
import ScanInlineResult from "../components/ScanInlineResult";
import ScamScoreGauge from "../components/ScamScoreGauge";
import { SafetyRecommendation } from "../components/SidePanels";
import { analyzeQr } from "../api/qr";

export default function QrScanner() {
  const [decoded, setDecoded] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [decodeError, setDecodeError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setDecodeError("");
    setDecoded("");
    setResult(null);
    setPreviewUrl(URL.createObjectURL(file));

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code?.data) {
        setDecoded(code.data);
      } else {
        setDecodeError("Could not detect a QR code in this image. Try a clearer photo, or type the QR content manually below.");
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!decoded.trim()) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeQr(decoded);
      setResult(res.scan);
    } catch (err) {
      setError(err.response?.data?.message || "Could not analyze this QR code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active="QR Code Scanner" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>QR Code Scanner</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Upload a QR code image to decode and check what it links to.</p>
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 320px" }}>
          <div className="panel">
            <div className="panel-header">
              <h3>Scan QR Code</h3>
            </div>

            <label
              htmlFor="qr-upload"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "2px dashed #e5e7eb",
                borderRadius: 12,
                padding: previewUrl ? 12 : 40,
                cursor: "pointer",
                marginBottom: 16,
                background: "#fafafa",
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="QR preview" style={{ maxHeight: 180, borderRadius: 8 }} />
              ) : (
                <>
                  <span style={{ fontSize: 28 }}>▦</span>
                  <span style={{ color: "#6b7280", fontSize: 14 }}>Click to upload a QR code image</span>
                </>
              )}
            </label>
            <input
              id="qr-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {decodeError && <div className="error-banner" style={{ marginBottom: 14 }}>{decodeError}</div>}

            <form onSubmit={handleScan}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Decoded QR Content</label>
              <input
                type="text"
                value={decoded}
                onChange={(e) => setDecoded(e.target.value)}
                placeholder="Decoded text/URL will appear here — or type/paste it manually"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, margin: "8px 0 14px" }}
              />
              <button type="submit" className="btn-primary" style={{ width: "auto", padding: "12px 28px" }} disabled={loading || !decoded.trim()}>
                {loading ? "Analyzing..." : "🔍 Scan QR Data"}
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
