export default function ScamScoreGauge({ score = 0 }) {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = (clamped / 100) * 180; // 0-180 degrees across the semicircle
  const radius = 80;
  const cx = 100;
  const cy = 100;

  // needle endpoint
  const rad = ((180 - angle) * Math.PI) / 180;
  const needleX = cx + radius * 0.75 * Math.cos(rad);
  const needleY = cy - radius * 0.75 * Math.sin(rad);

  const label = clamped >= 70 ? "Dangerous" : clamped >= 40 ? "Suspicious" : "Safe";
  const color = clamped >= 70 ? "#e53e3e" : clamped >= 40 ? "#f5a623" : "#16a34a";

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="200" height="120" viewBox="0 0 200 120">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#f5a623" />
            <stop offset="100%" stopColor="#e53e3e" />
          </linearGradient>
        </defs>
        <path
          d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill="#374151" />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af", padding: "0 16px" }}>
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color }}>{clamped}%</div>
      <div style={{ fontWeight: 700, color }}>{label}</div>
    </div>
  );
}
