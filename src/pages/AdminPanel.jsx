import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAllUsersAdmin } from "../api/admin";

export default function AdminPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllUsersAdmin()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || "Could not load users"))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = data?.users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Sidebar active="Admin Panel" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>Admin Panel</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>All registered users and their scan activity.</p>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {loading && <p style={{ color: "#6b7280" }}>Loading users...</p>}

        {!loading && data && (
          <>
            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              <div className="panel" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{data.totalUsers}</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>Total Registered Users</div>
              </div>
              <div className="panel" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#6c4bf4" }}>{data.totalScansAcrossAllUsers}</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>Total Scans (all users)</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Users</h3>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, width: 240 }}
                />
              </div>

              {filteredUsers.length === 0 ? (
                <p style={{ color: "#9ca3af", padding: "24px 0" }}>No users match this search.</p>
              ) : (
                <div className="scans-table-wrapper">
                  <table className="scans-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Total Scans</th>
                      <th>Safe</th>
                      <th>Suspicious</th>
                      <th>Dangerous</th>
                      <th>Last Scan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="avatar-circle" style={{ width: 28, height: 28, fontSize: 12 }}>{u.avatarInitial}</div>
                          {u.name} {u.role === "admin" && <span style={{ fontSize: 11, background: "#ede9fe", color: "#6c4bf4", padding: "2px 8px", borderRadius: 999, marginLeft: 4 }}>admin</span>}
                        </td>
                        <td>{u.email}</td>
                        <td>{new Date(u.joinedAt).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 700 }}>{u.totalScans}</td>
                        <td className="score-safe">{u.safe}</td>
                        <td className="score-suspicious">{u.suspicious}</td>
                        <td className="score-dangerous">{u.dangerous}</td>
                        <td>{u.lastScanAt ? new Date(u.lastScanAt).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
