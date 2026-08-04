const styles = {
  Safe: { bg: "#dcfce7", color: "#16a34a" },
  Suspicious: { bg: "#fef3c7", color: "#d97706" },
  Dangerous: { bg: "#fee2e2", color: "#dc2626" },
};

const icons = { Safe: "🛡️", Suspicious: "⚠️", Dangerous: "⛔" };

export default function VerdictBadge({ verdict, size = "md" }) {
  const s = styles[verdict] || styles.Suspicious;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: size === "sm" ? "3px 10px" : "5px 14px",
        borderRadius: 999,
        fontSize: size === "sm" ? 12 : 13,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
      }}
    >
      {icons[verdict]} {verdict}
    </span>
  );
}
