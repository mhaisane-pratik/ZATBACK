import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "./admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      {/* LEFT SIDEBAR */}
      <AdminSidebar />

      {/* RIGHT CONTENT */}
      <div className="admin-main">
        {/* TOP HEADER */}
        <header className="admin-header">
          <h2>Admin Dashboard</h2>

          <button
            className="back-user-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to User Dashboard
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
