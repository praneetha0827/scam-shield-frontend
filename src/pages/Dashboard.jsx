import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ScanAnything from "../components/ScanAnything";
import RecentScanResult from "../components/RecentScanResult";
import RecentScansTable from "../components/RecentScansTable";
import ScamScoreGauge from "../components/ScamScoreGauge";
import { SafetyRecommendation, SecurityTip } from "../components/SidePanels";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats, getRecentScans, getLatestScan } from "../api/dashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [latestScan, setLatestScan] = useState(null);
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, recentRes, latestRes] = await Promise.all([
          getDashboardStats(),
          getRecentScans(5),
          getLatestScan(),
        ]);
        setStats(statsRes.stats);
        setTip(statsRes.tipOfTheDay);
        setRecentScans(recentRes.scans);
        setLatestScan(latestRes.scan);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar active="Dashboard" />
      <main className="main-content">
        <div className="top-header">
          <div>
            <h1>
              Welcome, <span style={{ color: "#6c4bf4" }}>{user?.name}</span> 👋
            </h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Stay safe from digital scams. We analyze. You relax.</p>
          </div>
          <div className="user-chip">
            <div className="avatar-circle">{user?.avatarInitial}</div>
            <span>{user?.name}</span>
          </div>
        </div>

        {loading && <p style={{ color: "#6b7280" }}>Loading dashboard...</p>}
        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && stats && (
          <>
            <div className="stats-grid">
              <StatCard variant="purple" title="Total Scans" value={stats.total} sub={`↑ ${stats.thisWeek} this week`} icon="📈" />
              <StatCard variant="safe" title="Safe" value={stats.safe.count} sub={`${stats.safe.pct}% of total`} icon="✅" />
              <StatCard variant="suspicious" title="Suspicious" value={stats.suspicious.count} sub={`${stats.suspicious.pct}% of total`} icon="⚠️" />
              <StatCard variant="dangerous" title="Dangerous" value={stats.dangerous.count} sub={`${stats.dangerous.pct}% of total`} icon="⛔" />
            </div>

            <div className="dashboard-grid">
              <ScanAnything />

              <div>
                <RecentScanResult scan={latestScan} />
                <RecentScansTable scans={recentScans} />
              </div>

              <div>
                <div className="panel" style={{ marginBottom: 20 }}>
                  <div className="panel-header">
                    <h3>AI Scam Score Guide</h3>
                  </div>
                  <ScamScoreGauge score={latestScan?.score ?? 0} />
                  <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 10 }}>
                    Scores closer to 100% indicate higher risk of being a scam.
                  </p>
                </div>
                <SafetyRecommendation verdict={latestScan?.verdict} />
                <SecurityTip tip={tip} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
