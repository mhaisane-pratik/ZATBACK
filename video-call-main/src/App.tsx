import { Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

// 🌍 Public Pages
import Landing from "./features/landing/Landing";
import Login from "./features/auth/Login";

// 💬 Chat Login (simple username setup)
import ChatLogin from "./pages/Login"; // chat-only login
import Chat from "./pages/Chat";

// 🔐 Protected Pages
import Dashboard from "./features/dashboard/Dashboard";
import PreJoin from "./features/meeting/PreJoin";
import MeetingRoom from "./features/meeting/MeetingRoom";
import Calendar from "./features/calendar/Calendar";
import Recordings from "./features/recordings/Recordings";
import Settings from "./features/settings/Settings";

import ProtectedRoute from "./app/ProtectedRoute";
import AnalyticsPage from "./features/analytics/AnalyticsPage";
export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* 🌍 LANDING */}
        <Route path="/" element={<Landing />} />

        {/* 🔐 MAIN APP LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 💬 CHAT LOGIN (ONLY IF USERNAME MISSING) */}
        <Route 
          path="/chat-login" 
          element={
            <ProtectedRoute>
              <ChatLogin />
            </ProtectedRoute>
          } 
        />

        {/* 📊 DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 💬 CHAT (OPENED FROM DASHBOARD OR DIRECTLY) */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* 🎥 MEETINGS */}
        <Route
          path="/prejoin"
          element={
            <ProtectedRoute>
              <PreJoin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meeting"
          element={
            <ProtectedRoute>
              <MeetingRoom />
            </ProtectedRoute>
          }
        />

        {/* 📅 OTHER PAGES */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recordings"
          element={
            <ProtectedRoute>
              <Recordings />
            </ProtectedRoute>
          }
        />
<Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <AnalyticsPage />
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

        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}