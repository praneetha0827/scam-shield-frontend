import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getReportSummary, downloadCsvReport } from "../api/reports";

const verdictColors = { Safe: "#16a34a", Suspicious: "#f5a623", Dangerous: "#e53e3e" };
const typeColors = ["#6c4bf4", "#0f9d6c", "#f5a623", "#2563eb", "#dc2626", "#16a34a"];

function BarRow({ label, count, max, color }) {
  const pct = max > 0 ? Math.max(4, Math.round((count / max) * 100)) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
        <span style={{ color: "#374151" }}>{label}</span>
        <span style={{ color: "#6b7280", fontWeight: 600 }}>{count}</span>
      </div>
      <div style={{ background: "#f3f4f6", borderRadius: 6, height: 10 }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 6 }} />
      </div>
    </div>
  );
}

export default function Reports() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getReportSummary(days)
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || "Could not load report"))
      .finally(() => setLoading(false));
  }, [days]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadCsvReport();
    } catch {
      setError("Could not export the CSV report");
    } finally {
      setExporting(false);
    }
  };

  const maxTypeCount = data ? Math.max(1, ...data.byType.map((t) => t.count)) : 1;
  const maxTrend = data ? Math.max(1, ...data.trend.map((t) => t.count)) : 1;
  const verdictLookup = data ? Object.fromEntries(data.byVerdict.map((v) => [v._id, v.count])) : {};
  const totalScans = data ? data.byVerdict.reduce((s, v) => s + v.count, 0) : 0;

  return (
    <div className="app-shell">
      <Sidebar active="Reports" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>Reports</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Trends and breakdowns across all your scans.</p>
          </div>
          <button className="btn-primary" style={{ width: "auto", padding: "10px 20px" }} onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting..." : "⬇ Export CSV"}
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {loading && <p style={{ color: "#6b7280" }}>Loading report...</p>}

        {!loading && data && (
          <>
            <div className="stats-grid">
              <div className="panel" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{totalScans}</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>Total Scans (all time)</div>
              </div>
              <div className="panel" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: verdictColors.Safe }}>{verdictLookup.Safe || 0}</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>Safe</div>
              </div>
              <div className="panel" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: verdictColors.Suspicious }}>{verdictLookup.Suspicious || 0}</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>Suspicious</div>
              </div>
              <div className="panel" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: verdictColors.Dangerous }}>{verdictLookup.Dangerous || 0}</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>Dangerous</div>
              </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="panel">
                <div className="panel-header">
                  <h3>Scans by Type</h3>
                </div>
                {data.byType.length === 0 ? (
                  <p style={{ color: "#9ca3af" }}>No scans yet.</p>
                ) : (
                  data.byType.map((t, i) => (
                    <BarRow key={t._id} label={t._id} count={t.count} max={maxTypeCount} color={typeColors[i % typeColors.length]} />
                  ))
                )}
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3>Most Common Scam Patterns</h3>
                </div>
                {data.topReasons.length === 0 ? (
                  <p style={{ color: "#9ca3af" }}>No flagged patterns yet.</p>
                ) : (
                  data.topReasons.map((r) => (
                    <BarRow key={r.reason} label={r.reason} count={r.count} max={data.topReasons[0].count} color="#dc2626" />
                  ))
                )}
              </div>
            </div>

            <div className="panel" style={{ marginTop: 20 }}>
              <div className="panel-header" style={{ flexWrap: "wrap", gap: 10 }}>
                <h3>Scan Activity</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {[7, 30, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        background: days === d ? "#6c4bf4" : "#fff",
                        color: days === d ? "#fff" : "#374151",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {data.trend.length === 0 ? (
                <p style={{ color: "#9ca3af" }}>No scans in this period.</p>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 140, padding: "10px 0" }}>
                  {data.trend.map((d) => (
                    <div key={d._id} title={`${d._id}: ${d.count} scan(s)`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div
                        style={{
                          width: "100%",
                          height: `${Math.max(4, (d.count / maxTrend) * 110)}px`,
                          background: d.dangerous > 0 ? "#e53e3e" : "#6c4bf4",
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
                Bar height = scans that day. Red bars indicate at least one Dangerous result.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
