import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar active="Settings" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>Settings</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Manage your account details.</p>
          </div>
        </div>

        <div className="panel" style={{ maxWidth: 480 }}>
          <div className="panel-header">
            <h3>Profile</h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <div className="avatar-circle" style={{ width: 56, height: 56, fontSize: 20 }}>
              {user?.avatarInitial}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>{user?.email}</div>
            </div>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input type="text" value={user?.name || ""} disabled />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user?.email || ""} disabled />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input type="text" value={user?.role === "admin" ? "Administrator" : "Standard User"} disabled />
          </div>

          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
            To change your password, contact support or use the password reset option on the login page.
          </p>
        </div>
      </main>
    </div>
  );
}
