import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      logout();
      navigate("/login");
    }
  };

  return (
    <>
      {/* Hamburger button - only visible on mobile via CSS */}
      <button className="hamburger-btn" onClick={() => setIsOpen(true)} aria-label="Open menu">
        ☰
      </button>

      {/* Dark overlay behind sidebar when open on mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="auth-logo-icon">🛡️</div>
            <div>
              <h1>Scam Shield</h1>
              <p>AI-Powered Scam Protection</p>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close menu">
            ✕
          </button>
        </div>

        {links.map((l) => (
          <Link
            key={l.label}
            to={l.path}
            onClick={closeSidebar}
            className={`sidebar-link ${active === l.label ? "active" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <span>{l.icon}</span> {l.label}
          </Link>
        ))}

        {user?.role === "admin" && (
          <Link
            to="/admin"
            onClick={closeSidebar}
            className={`sidebar-link ${active === "Admin Panel" ? "active" : ""}`}
            style={{ textDecoration: "none", background: active === "Admin Panel" ? undefined : "#1c1c3d" }}
          >
            <span>🛠️</span> Admin Panel
          </Link>
        )}

        <div className="sidebar-link" onClick={handleLogout}>
          <span>↩️</span> Logout
        </div>
      </aside>
    </>
  );
}