import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

import Overview from "./pages/Overview";
import Users from "./pages/Users";
import Teams from "./pages/Teams";
import Meetings from "./pages/Meetings";
import Chats from "./pages/Chats";
import Files from "./pages/Files";
import Analytics from "./pages/Analytics";
import Roles from "./pages/Roles";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminDashboard />}>
        <Route index element={<Overview />} />
        <Route path="users" element={<Users />} />
        <Route path="teams" element={<Teams />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="chats" element={<Chats />} />
        <Route path="files" element={<Files />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="roles" element={<Roles />} />
        <Route path="settings" element={<Settings />} />
        <Route path="billing" element={<Billing />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
