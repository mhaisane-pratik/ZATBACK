import { useNavigate } from "react-router-dom";
import "./layout.css";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <h2 className="logo">Verzat Meet</h2>

      <nav className="nav">
        <a onClick={() => navigate("/dashboard")}>Dashboard</a>
        <a onClick={() => navigate("/chat")}>Chat</a>
        <a onClick={() => navigate("/calendar")}>Calendar</a>
        <a onClick={() => navigate("/recordings")}>Recordings</a>
        <a onClick={() => navigate("/settings")}>Settings</a>
      </nav>
    </aside>
  );
}
