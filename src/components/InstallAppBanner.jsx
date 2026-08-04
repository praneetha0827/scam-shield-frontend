import { useEffect, useState } from "react";

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#12122b",
        color: "#fff",
        padding: "14px 18px",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        zIndex: 1000,
      }}
    >
      <span style={{ fontSize: 14 }}>📲 Install Scam Shield as an app?</span>
      <button
        onClick={handleInstall}
        style={{ background: "#6c4bf4", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
      >
        Install
      </button>
      <button
        onClick={() => setVisible(false)}
        style={{ background: "transparent", color: "#9a9ac0", border: "none", fontSize: 16, cursor: "pointer" }}
      >
        ✕
      </button>
    </div>
  );
}
