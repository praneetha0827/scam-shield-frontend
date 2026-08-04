import Sidebar from "../components/Sidebar";

const tipSections = [
  {
    title: "📱 SMS & Text Scams",
    tips: [
      "Never click links in texts claiming you've won a prize or refund.",
      "Banks and government agencies never ask for OTPs or PINs via SMS.",
      "Be wary of urgent language like 'act now' or 'account will be suspended'.",
      "Verify shortened URLs (bit.ly, tinyurl) before clicking — they can hide malicious sites.",
    ],
  },
  {
    title: "✉️ Email & Phishing",
    tips: [
      "Check the sender's actual email address, not just the display name.",
      "Watch for lookalike domains (e.g. paypa1.com instead of paypal.com).",
      "Legitimate companies rarely use generic greetings like 'Dear Customer'.",
      "Never enter passwords or card details from an email link — go to the site directly instead.",
    ],
  },
  {
    title: "🌐 Websites & Links",
    tips: [
      "Always check for HTTPS (the padlock icon) before entering any information.",
      "Be suspicious of unusual domain extensions like .xyz, .top, or .club on shopping sites.",
      "Avoid sites with excessive subdomains or hyphens in the URL.",
      "If a deal looks too good to be true, it usually is.",
    ],
  },
  {
    title: "📞 Phone & Voice Scams",
    tips: [
      "Government agencies and banks don't threaten arrest over the phone.",
      "Never install remote-access apps (AnyDesk, TeamViewer) for someone who called you.",
      "Be cautious of robocalls asking you to 'press 1' to speak to an agent.",
      "Hang up and call the official number yourself if you're unsure.",
    ],
  },
  {
    title: "💬 WhatsApp & Messaging Apps",
    tips: [
      "Be cautious of messages from unknown numbers offering jobs, loans, or investments.",
      "Scammers often impersonate friends or family claiming to be in urgent trouble.",
      "Never forward OTPs, even to people claiming to be from WhatsApp support.",
      "Verify unusual requests from known contacts through a different channel (call them).",
    ],
  },
];

export default function SafetyTips() {
  return (
    <div className="app-shell">
      <Sidebar active="Safety Tips" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>Safety Tips</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Practical advice to help you recognize and avoid common scams.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          {tipSections.map((section) => (
            <div className="panel" key={section.title}>
              <div className="panel-header">
                <h3>{section.title}</h3>
              </div>
              <ul className="safety-list">
                {section.tips.map((tip, i) => (
                  <li key={i}>✅ {tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
