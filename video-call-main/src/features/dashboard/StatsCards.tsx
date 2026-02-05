import { FiTrendingUp } from "react-icons/fi";
import { MdOutlineMeetingRoom, MdOutlineVideoLibrary, MdOutlineGroups } from "react-icons/md";
import "./dashboard.css";

interface StatsCardsProps {
  isDarkMode?: boolean;
}

export default function StatsCards({ isDarkMode = false }: StatsCardsProps) {
  const stats = [
    {
      label: "Total Meetings",
      value: "128",
      icon: <MdOutlineMeetingRoom className="stat-card-icon" />,
      color: isDarkMode ? "#6366F1" : "#4F46E5",
      trend: "+12%",
      description: "This month"
    },
    {
      label: "Active Users",
      value: "42",
      icon: <MdOutlineGroups className="stat-card-icon" />,
      color: "#10B981",
      trend: "+8%",
      description: "Online now"
    },
    {
      label: "Recorded Hours",
      value: "96h",
      icon: <MdOutlineVideoLibrary className="stat-card-icon" />,
      color: isDarkMode ? "#8B5CF6" : "#8B5CF6",
      trend: "+24%",
      description: "Total recorded"
    },
    {
      label: "Engagement Avg",
      value: "78%",
      icon: <FiTrendingUp className="stat-card-icon" />,
      color: "#F59E0B",
      trend: "+5%",
      description: "Meeting efficiency"
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div 
          className="stat-card glass-card" 
          key={stat.label}
          style={{ '--card-color': stat.color } as React.CSSProperties}
        >
          <div className="stat-card-header">
            <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15` }}>
              {stat.icon}
            </div>
            <span className="stat-trend positive">
              {stat.trend}
            </span>
          </div>
          <div className="stat-card-content">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-description">{stat.description}</p>
          </div>
          <div className="stat-card-progress">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${parseInt(stat.value)}%`,
                backgroundColor: stat.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}