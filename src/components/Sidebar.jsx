import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const links = [
  { label: "Dashboard", icon: "Home", path: "/dashboard" },
  { label: "AI Scam Interceptor", icon: "AI", path: "/scam-interceptor" },
  { label: "SMS Scanner", icon: "SMS", path: "/sms-scanner" },
  { label: "Email Scanner", icon: "Mail", path: "/email-scanner" },
  { label: "QR Code Scanner", icon: "QR", path: "/qr-scanner" },
  { label: "Website Checker", icon: "Web", path: "/website-checker" },
  { label: "Voice Scam Analyzer", icon: "Voice", path: "/voice-analyzer" },
  { label: "Caller Protection", icon: "Call", path: "/caller-protection" },
  { label: "WhatsApp Analyzer", icon: "WA", path: "/whatsapp-analyzer" },
  { label: "UPI Guardian", icon: "Rs", path: "/upi-guardian" },
  { label: "History", icon: "Log", path: "/history" },
  { label: "Safety Tips", icon: "Tips", path: "/safety-tips" },
  { label: "Reports", icon: "Data", path: "/reports" },
  { label: "Settings", icon: "Gear", path: "/settings" },
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
      <button className="hamburger-btn" onClick={() => setIsOpen(true)} aria-label="Open menu">
        Menu
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="auth-logo-icon">SS</div>
            <div>
              <h1>Scam Shield</h1>
              <p>AI-Powered Scam Protection</p>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close menu">
            X
          </button>
        </div>

        {links.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            onClick={closeSidebar}
            className={`sidebar-link ${active === link.label ? "active" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <span>{link.icon}</span> {link.label}
          </Link>
        ))}

        {user?.role === "admin" && (
          <Link
            to="/admin"
            onClick={closeSidebar}
            className={`sidebar-link ${active === "Admin Panel" ? "active" : ""}`}
            style={{ textDecoration: "none", background: active === "Admin Panel" ? undefined : "#1c1c3d" }}
          >
            <span>Admin</span> Admin Panel
          </Link>
        )}

        <div className="sidebar-link" onClick={handleLogout}>
          <span>Exit</span> Logout
        </div>
      </aside>
    </>
  );
}
