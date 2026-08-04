import { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import ScanInlineResult from "../components/ScanInlineResult";
import ScamScoreGauge from "../components/ScamScoreGauge";
import { SafetyRecommendation } from "../components/SidePanels";
import { analyzeVoice } from "../api/voice";

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceAnalyzer() {
  const [callerNumber, setCallerNumber] = useState("");
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  const startRecording = () => {
    setRecordError("");
    if (!SpeechRecognitionAPI) {
      setRecordError("Live transcription isn't supported in this browser. Paste the call transcript manually instead.");
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript + " ";
      }
      setTranscript((prev) => (prev ? prev + " " : "") + finalText.trim());
    };
    recognition.onerror = (e) => setRecordError(`Microphone error: ${e.error}`);
    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeVoice(callerNumber, transcript);
      setResult(res.scan);
    } catch (err) {
      setError(err.response?.data?.message || "Could not analyze this call");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active="Voice Scam Analyzer" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>Voice Scam Analyzer</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Record or paste a call transcript to check for scam patterns.</p>
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 320px" }}>
          <div className="panel">
            <div className="panel-header">
              <h3>Analyze Call</h3>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Caller Number (optional)</label>
            <input
              type="text"
              value={callerNumber}
              onChange={(e) => setCallerNumber(e.target.value)}
              placeholder="e.g. Unknown, Private, or +1 800-XXX-XXXX"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, margin: "8px 0 16px" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Call Transcript</label>
              {!recording ? (
                <button type="button" onClick={startRecording} className="btn-primary" style={{ width: "auto", padding: "6px 14px", fontSize: 13 }}>
                  🎙️ Record &amp; Transcribe
                </button>
              ) : (
                <button type="button" onClick={stopRecording} style={{ width: "auto", padding: "6px 14px", fontSize: 13, background: "#e53e3e", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
                  ⏹ Stop Recording
                </button>
              )}
            </div>

            {recordError && <div className="error-banner" style={{ marginBottom: 12 }}>{recordError}</div>}
            {recording && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 8 }}>🔴 Listening... speak now, or read out the call.</p>}

            <form onSubmit={handleScan}>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste or record what the caller said, e.g. 'This is the Income Tax Department, there is a legal action against you, press 1 to speak to an officer...'"
                rows={7}
                style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, fontFamily: "inherit", resize: "vertical", marginBottom: 14 }}
              />
              <button type="submit" className="btn-primary" style={{ width: "auto", padding: "12px 28px" }} disabled={loading || !transcript.trim()}>
                {loading ? "Analyzing..." : "🔍 Scan Call"}
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
