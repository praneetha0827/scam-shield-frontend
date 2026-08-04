const palettes = {
  purple: { bg: "linear-gradient(135deg,#6c4bf4,#8b6bff)", text: "#fff" },
  safe: { bg: "linear-gradient(135deg,#0f9d6c,#0bb37f)", text: "#fff" },
  suspicious: { bg: "linear-gradient(135deg,#f5a623,#f57c00)", text: "#fff" },
  dangerous: { bg: "linear-gradient(135deg,#e53e3e,#c0392b)", text: "#fff" },
};

export default function StatCard({ variant, title, value, sub, icon }) {
  const p = palettes[variant] || palettes.purple;
  return (
    <div className="stat-card" style={{ background: p.bg, color: p.text }}>
      <div className="stat-card-top">
        <span>{title}</span>
        <span className="stat-card-icon">{icon}</span>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-sub">{sub}</div>
    </div>
  );
}
