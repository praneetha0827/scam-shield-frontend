import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import VerdictBadge from "../components/VerdictBadge";
import { getScanHistory } from "../api/history";

const TYPE_OPTIONS = ["", "SMS", "Email", "Website", "QR Code", "Voice", "WhatsApp", "UPI", "Interceptor", "Caller"];
const VERDICT_OPTIONS = ["", "Safe", "Suspicious", "Dangerous"];
const typeIcons = { SMS: "💬", Email: "✉️", Website: "🌐", "QR Code": "▦", Voice: "🎙️", WhatsApp: "💚" };

const selectStyle = {
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 13,
  background: "#fff",
};

export default function History() {
  const [scans, setScans] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [type, setType] = useState("");
  const [verdict, setVerdict] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getScanHistory({ page, limit: 10, type, verdict })
      .then((res) => {
        setScans(res.scans);
        setPagination(res.pagination);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load scan history"))
      .finally(() => setLoading(false));
  }, [page, type, verdict]);

  const changeFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="app-shell">
      <Sidebar active="History" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>Scan History</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>All your past scans across every module.</p>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header" style={{ flexWrap: "wrap", gap: 12 }}>
            <h3>{pagination.total} total scan{pagination.total !== 1 ? "s" : ""}</h3>
            <div style={{ display: "flex", gap: 10 }}>
              <select value={type} onChange={changeFilter(setType)} style={selectStyle}>
                <option value="">All Types</option>
                {TYPE_OPTIONS.filter(Boolean).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select value={verdict} onChange={changeFilter(setVerdict)} style={selectStyle}>
                <option value="">All Results</option>
                {VERDICT_OPTIONS.filter(Boolean).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}
          {loading ? (
            <p style={{ color: "#6b7280", padding: "24px 0" }}>Loading...</p>
          ) : scans.length === 0 ? (
            <p style={{ color: "#9ca3af", padding: "24px 0" }}>No scans match these filters.</p>
          ) : (
            <>
              <table className="scans-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Input</th>
                    <th>Result</th>
                    <th>Score</th>
                    <th>Date &amp; Time</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((s) => (
                    <tr key={s._id}>
                      <td>{typeIcons[s.type] || "📄"} {s.type}</td>
                      <td>{s.input.length > 50 ? s.input.slice(0, 50) + "..." : s.input}</td>
                      <td><VerdictBadge verdict={s.verdict} size="sm" /></td>
                      <td className={`score-${s.verdict.toLowerCase()}`}>{s.score}%</td>
                      <td>{new Date(s.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: page <= 1 ? "not-allowed" : "pointer", fontSize: 13 }}
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page >= pagination.pages}
                    style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: page >= pagination.pages ? "not-allowed" : "pointer", fontSize: 13 }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
