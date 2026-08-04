import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SmsScanner from "./pages/SmsScanner";
import EmailScanner from "./pages/EmailScanner";
import WebsiteChecker from "./pages/WebsiteChecker";
import QrScanner from "./pages/QrScanner";
import VoiceAnalyzer from "./pages/VoiceAnalyzer";
import WhatsAppAnalyzer from "./pages/WhatsAppAnalyzer";
import SafetyTips from "./pages/SafetyTips";
import Settings from "./pages/Settings";
import History from "./pages/History";
import Reports from "./pages/Reports";
import AdminPanel from "./pages/AdminPanel";
import InstallAppBanner from "./components/InstallAppBanner";
import AdminRoute from "./components/AdminRoute";
import "./styles/global.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms-scanner"
            element={
              <ProtectedRoute>
                <SmsScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/email-scanner"
            element={
              <ProtectedRoute>
                <EmailScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/website-checker"
            element={
              <ProtectedRoute>
                <WebsiteChecker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr-scanner"
            element={
              <ProtectedRoute>
                <QrScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voice-analyzer"
            element={
              <ProtectedRoute>
                <VoiceAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/whatsapp-analyzer"
            element={
              <ProtectedRoute>
                <WhatsAppAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safety-tips"
            element={
              <ProtectedRoute>
                <SafetyTips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <InstallAppBanner />
      </BrowserRouter>
    </AuthProvider>
  );
}