# Scam Shield — Frontend (Module 1 + Module 2: Foundation & Authentication)

## Setup
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Runs at `http://localhost:3000`.

## What's included
- `/login` and `/register` pages, wired to the backend JWT API
- `AuthContext` — global login state, token stored in localStorage
- `ProtectedRoute` — redirects to `/login` if not authenticated
- `/dashboard` — placeholder shell with sidebar (full stats/cards come in Module 3)

Make sure the backend is running first at `http://localhost:5000`.

## Module 3 — Dashboard
`/dashboard` now renders live data from the backend:
- Stat cards (Total / Safe / Suspicious / Dangerous)
- "Scan Anything" quick-launch panel (buttons wired up in Modules 4-8)
- Recent Scan Result panel with AI analysis reasons
- AI Scam Score gauge (SVG semicircle)
- Safety Recommendation + Security Tip of the Day
- Recent Scans table

Run `node seed.js <your-email>` in the backend folder first so there's data to display.

## Module 4 — SMS Detection
`/sms-scanner` — paste any SMS text, click Scan, and it calls `POST /api/sms/analyze` for a live verdict, score, and matched scam patterns. Every scan is saved and will show up on the Dashboard's Recent Scans automatically. The other "Scan Anything" buttons stay disabled until their modules are built.

## Module 5 — Email Detection
`/email-scanner` — enter sender email, subject, and body; calls `POST /api/email/analyze`. Flags lookalike domains, brand-impersonation-from-freemail, generic greetings, plus all the SMS-style text rules. Shares the `ScanInlineResult` component with the SMS Scanner for a consistent result display.

## Module 6 — Website Analysis
`/website-checker` — paste any URL; calls `POST /api/website/analyze`. Flags missing HTTPS, IP-based URLs, scam TLDs, excessive hyphens/subdomains, scam keywords, lookalike domains, and shorteners.

## Module 7 — QR Code Scanner
`/qr-scanner` — upload a QR code image; it's decoded entirely in the browser using `jsqr` (drawn to a hidden canvas, no image ever leaves the client). The decoded text is editable and sent to `POST /api/qr/analyze`, which routes it through the website or text analyzer depending on whether it looks like a URL.

## Module 8 — Voice Scam Analyzer
`/voice-analyzer` — paste a call transcript, or click "Record & Transcribe" to use the browser's built-in speech recognition (Web Speech API — Chrome/Edge support it, falls back to manual paste elsewhere) and transcribe live speech into the textbox. Sent to `POST /api/voice/analyze` for scoring.

## Module 9 — History
`/history` — paginated table of every scan across all modules, with Type and Result filters. Uses the `GET /api/scans` endpoint that's been live since Module 3 (page/limit/type/verdict query params). The Dashboard's "View all" link and the sidebar's History link both point here.

## Module 10 — Reports
`/reports` — total/safe/suspicious/dangerous summary cards, a "Scans by Type" breakdown, "Most Common Scam Patterns" (aggregated from every scan's `reasons`), a 7/30/90-day activity bar chart (red bars = a Dangerous result happened that day), and a CSV export button. No chart library added — bars are plain divs sized from the data, keeping the bundle light.

**This completes all 10 modules from the original plan.**

## Bonus — PWA (installable app)
- `public/manifest.json` — app name, icons, theme color, `start_url: /dashboard`
- `public/service-worker.js` — caches the app shell for offline use, always goes to network for `/api/*` calls (never serves stale scan data)
- `src/serviceWorkerRegistration.js` — registers the service worker (production builds only, i.e. `npm run build` output — service workers require HTTPS or localhost)
- `InstallAppBanner` component — shows a small "Install Scam Shield as an app?" prompt when the browser fires `beforeinstallprompt`

To actually test installability: run `npm run build` then serve the `build/` folder (e.g. `npx serve -s build`) — `npm start`'s dev server doesn't register service workers. Once served over localhost/HTTPS, Chrome/Edge will show the install icon in the address bar, or you'll see the in-app banner.

## Bonus — Admin Panel
`/admin` — visible only to users with `role: "admin"` (an "Admin Panel" link appears in the sidebar automatically once a user is promoted). Shows total users, total scans across everyone, and a searchable table of every user with their scan counts by verdict and last scan date. Backed by `GET /api/admin/users`.

To make yourself an admin, run `node makeAdmin.js you@example.com` in the backend folder, then refresh the app.
