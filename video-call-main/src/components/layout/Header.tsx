import { FiMenu } from "react-icons/fi";
import "./layout.css";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick}>
        <FiMenu />
      </button>

      <h3 className="title">Dashboard</h3>
    </header>
  );
}
