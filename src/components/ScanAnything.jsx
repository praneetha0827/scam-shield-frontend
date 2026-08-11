import { Link } from "react-router-dom";

const options = [
  { label: "AI Scam Interceptor", icon: "AI", color: "#eef2ff", text: "#4f46e5", path: "/scam-interceptor" },
  { label: "Scan SMS", icon: "SMS", color: "#e8f0fe", text: "#2563eb", path: "/sms-scanner" },
  { label: "Scan Email", icon: "Mail", color: "#e6f9f1", text: "#0f9d6c", path: "/email-scanner" },
  { label: "Scan QR Code", icon: "QR", color: "#f0edfe", text: "#6c4bf4", path: "/qr-scanner" },
  { label: "Check Website", icon: "Web", color: "#fef6e6", text: "#d97706", path: "/website-checker" },
  { label: "Analyze Voice", icon: "Voice", color: "#fdecec", text: "#dc2626", path: "/voice-analyzer" },
  { label: "Caller Protection", icon: "Call", color: "#fff1f2", text: "#be123c", path: "/caller-protection" },
  { label: "Analyze WhatsApp", icon: "WA", color: "#e6f9ee", text: "#16a34a", path: "/whatsapp-analyzer" },
  { label: "UPI Guardian", icon: "Rs", color: "#ecfdf5", text: "#047857", path: "/upi-guardian" },
];

export default function ScanAnything() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Scan Anything</h3>
      </div>
      <div className="scan-anything-list">
        {options.map((option) => (
          <Link
            key={option.label}
            to={option.path}
            className="scan-option-btn"
            style={{ background: option.color, color: option.text, textDecoration: "none" }}
          >
            <span>{option.icon}</span> {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
