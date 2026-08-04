// Registers /service-worker.js so the app can be installed and used offline.
// Only runs in production builds over HTTPS (or localhost) — browsers require this.
export function registerServiceWorker() {
  if (process.env.NODE_ENV !== "production") return;
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((err) => console.error("Service worker registration failed:", err));
  });
}

export function unregisterServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.ready.then((registration) => registration.unregister());
}
