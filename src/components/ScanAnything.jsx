import { Link } from "react-router-dom";

const options = [
  { label: "Scan SMS", icon: "💬", color: "#e8f0fe", text: "#2563eb", path: "/sms-scanner" },
  { label: "Scan Email", icon: "✉️", color: "#e6f9f1", text: "#0f9d6c", path: "/email-scanner" },
  { label: "Scan QR Code", icon: "▦", color: "#f0edfe", text: "#6c4bf4", path: "/qr-scanner" },
  { label: "Check Website", icon: "🌐", color: "#fef6e6", text: "#d97706", path: "/website-checker" },
  { label: "Analyze Voice", icon: "🎙️", color: "#fdecec", text: "#dc2626", path: "/voice-analyzer" },
  { label: "Analyze WhatsApp", icon: "💚", color: "#e6f9ee", text: "#16a34a", path: null },
];

export default function ScanAnything() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Scan Anything</h3>
      </div>
      <div className="scan-anything-list">
        {options.map((o) =>
          o.path ? (
            <Link key={o.label} to={o.path} className="scan-option-btn" style={{ background: o.color, color: o.text, textDecoration: "none" }}>
              <span>{o.icon}</span> {o.label}
            </Link>
          ) : (
            <button key={o.label} className="scan-option-btn" style={{ background: o.color, color: o.text, opacity: 0.6, cursor: "not-allowed" }} title="Coming in a later module" disabled>
              <span>{o.icon}</span> {o.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
