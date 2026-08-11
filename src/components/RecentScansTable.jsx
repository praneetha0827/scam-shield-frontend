import VerdictBadge from "./VerdictBadge";

const typeIcons = { SMS: "💬", Email: "✉️", Website: "🌐", "QR Code": "▦", Voice: "🎙️", WhatsApp: "💚" };

function shorten(text, n = 34) {
  return text.length > n ? text.slice(0, n) + "..." : text;
}

export default function RecentScansTable({ scans }) {
  return (
    <div className="panel" style={{ marginTop: 24 }}>
      <div className="panel-header">
        <h3>Recent Scans</h3>
      </div>
      {scans.length === 0 ? (
        <p style={{ color: "#9ca3af", padding: "24px 0" }}>No scans recorded yet.</p>
      ) : (
        <div className="scans-table-wrapper">
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
                <td>{shorten(s.input)}</td>
                <td><VerdictBadge verdict={s.verdict} size="sm" /></td>
                <td className={`score-${s.verdict.toLowerCase()}`}>{s.score}%</td>
                <td>{new Date(s.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
