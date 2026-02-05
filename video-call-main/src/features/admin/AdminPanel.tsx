export default function AdminPanel() {
  return (
    <div className="page">
      <h2>Admin Panel</h2>

      <div className="admin-grid">
        <div className="admin-card">Manage Users</div>
        <div className="admin-card">Audit Logs</div>
        <div className="admin-card">Chat Restrictions</div>
        <div className="admin-card">Company Settings</div>
      </div>
    </div>
  );
}
