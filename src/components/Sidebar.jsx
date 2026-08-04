import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const links = [
  { label: "Dashboard", icon: "🏠", path: "/dashboard" },
  { label: "SMS Scanner", icon: "💬", path: "/sms-scanner" },
  { label: "Email Scanner", icon: "✉️", path: "/email-scanner" },
  { label: "QR Code Scanner", icon: "▦", path: "/qr-scanner" },
  { label: "Website Checker", icon: "🌐", path: "/website-checker" },
  { label: "Voice Scam Analyzer", icon: "🎙️", path: "/voice-analyzer" },
  { label: "WhatsApp Analyzer", icon: "💚", path: "/whatsapp-analyzer" },
  { label: "History", icon: "🕘", path: "/history" },
  { label: "Safety Tips", icon: "❓", path: "/safety-tips" },
  { label: "Reports", icon: "📋", path: "/reports" },
  { label: "Settings", icon: "⚙️", path: "/settings" },
];

export default function Sidebar({ active }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="auth-logo-icon">🛡️</div>
        <div>
          <h1>Scam Shield</h1>
          <p>AI-Powered Scam Protection</p>
        </div>
      </div>
      {links.map((l) => (
        <Link key={l.label} to={l.path} className={`sidebar-link ${active === l.label ? "active" : ""}`} style={{ textDecoration: "none" }}>
          <span>{l.icon}</span> {l.label}
        </Link>
      ))}
      {user?.role === "admin" && (
        <Link to="/admin" className={`sidebar-link ${active === "Admin Panel" ? "active" : ""}`} style={{ textDecoration: "none", background: active === "Admin Panel" ? undefined : "#1c1c3d" }}>
          <span>🛠️</span> Admin Panel
        </Link>
      )}
      <div
        className="sidebar-link"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        <span>↩️</span> Logout
      </div>
    </aside>
  );
}
