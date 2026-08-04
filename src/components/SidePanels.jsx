export function SafetyRecommendation({ verdict }) {
  const items =
    verdict === "Dangerous"
      ? [
          { icon: "❌", text: "Do not click on suspicious links" },
          { icon: "❌", text: "Do not share personal information" },
          { icon: "✅", text: "Block and report the sender" },
          { icon: "✅", text: "Stay alert and stay safe" },
        ]
      : [
          { icon: "✅", text: "Verify the sender before responding" },
          { icon: "✅", text: "Look for HTTPS and valid domains" },
          { icon: "✅", text: "When in doubt, don't click" },
          { icon: "✅", text: "Report anything suspicious" },
        ];

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Safety Recommendation</h3>
      </div>
      <ul className="safety-list">
        {items.map((it, i) => (
          <li key={i}>
            <span>{it.icon}</span> {it.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SecurityTip({ tip }) {
  return (
    <div className="panel tip-panel">
      <div className="panel-header">
        <h3>💡 Security Tip of the Day</h3>
      </div>
      <p style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.5 }}>{tip}</p>
    </div>
  );
}
