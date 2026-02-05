import { NavLink } from "react-router-dom";
import "./admin.css";

export default function AdminSidebar() {
  const links = [
    { to: "/admin", label: "Overview" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/teams", label: "Teams" },
    { to: "/admin/meetings", label: "Meetings" },
    { to: "/admin/chats", label: "Chats" },
    { to: "/admin/files", label: "Files" },
    { to: "/admin/analytics", label: "Analytics" },
    { to: "/admin/roles", label: "Roles" },
    { to: "/admin/settings", label: "Settings" },
    { to: "/admin/billing", label: "Billing" },
  ];

  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">Admin Panel</h2>

      <nav className="admin-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin"}
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
