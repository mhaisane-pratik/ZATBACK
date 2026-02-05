import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./analytics.css";
import { 
  FaHome, 
  FaChartLine, 
  FaUsers, 
  FaCalendarAlt, 
  FaComments,
  FaDownload,
  FaFilter,
  FaCalendar,
  FaChartBar,
  FaTable,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaSync
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for charts
const chartData = [
  { name: 'Jan', users: 65, meetings: 40 },
  { name: 'Feb', users: 78, meetings: 52 },
  { name: 'Mar', users: 90, meetings: 65 },
  { name: 'Apr', users: 81, meetings: 58 },
  { name: 'May', users: 56, meetings: 43 },
  { name: 'Jun', users: 120, meetings: 72 },
];

const pieData = [
  { name: 'Video Calls', value: 45, color: '#0088FE' },
  { name: 'Audio Calls', value: 25, color: '#00C49F' },
  { name: 'Screen Share', value: 20, color: '#FFBB28' },
  { name: 'Group Meetings', value: 10, color: '#FF8042' },
];

const recentActivities = [
  { id: 1, user: "John Doe", action: "Created meeting", time: "10:30 AM", status: "success" },
  { id: 2, user: "Jane Smith", action: "Sent 5 messages", time: "11:15 AM", status: "info" },
  { id: 3, user: "Bob Wilson", action: "Joined video call", time: "12:45 PM", status: "success" },
  { id: 4, user: "Alice Brown", action: "Meeting failed", time: "2:20 PM", status: "error" },
  { id: 5, user: "Charlie Davis", action: "Downloaded transcript", time: "3:30 PM", status: "info" },
];

const topUsers = [
  { id: 1, name: "John Doe", meetings: 42, messages: 124, avatar: "JD" },
  { id: 2, name: "Jane Smith", meetings: 38, messages: 98, avatar: "JS" },
  { id: 3, name: "Robert Johnson", meetings: 35, messages: 156, avatar: "RJ" },
  { id: 4, name: "Emily Davis", meetings: 31, messages: 87, avatar: "ED" },
  { id: 5, name: "Michael Wilson", meetings: 28, messages: 142, avatar: "MW" },
];

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([
    { label: "Total Users", value: 128, change: "+12%", trend: "up", icon: <FaUsers /> },
    { label: "Total Meetings", value: 342, change: "+8%", trend: "up", icon: <FaCalendarAlt /> },
    { label: "Messages Sent", value: 9210, change: "+23%", trend: "up", icon: <FaComments /> },
    { label: "Active Today", value: 37, change: "-5%", trend: "down", icon: <FaChartLine /> },
    { label: "Avg Duration", value: "24m", change: "+2%", trend: "up", icon: <FaCalendar /> },
    { label: "Success Rate", value: "94%", change: "+1.2%", trend: "up", icon: <FaChartBar /> },
  ]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  const handleExport = () => {
    setExporting(true);
    // Simulate export process
    setTimeout(() => {
      setExporting(false);
      alert("Analytics data exported successfully!");
    }, 1500);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Update stats with random changes
      setStats(prev => prev.map(stat => ({
        ...stat,
        value: typeof stat.value === 'number' 
          ? stat.value + Math.floor(Math.random() * 10)
          : stat.value
      })));
    }, 1000);
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <FaArrowUp className="trend-icon up" /> : <FaArrowDown className="trend-icon down" />;
  };

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-left">
          <button className="home-icon-btn" onClick={handleHomeClick}>
            <FaHome className="home-icon" />
          </button>
          <h2>Analytics Dashboard</h2>
          <span className="last-updated">Last updated: Just now</span>
        </div>
        <div className="header-actions">
          <button 
            className="refresh-btn" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <FaSync className={loading ? "spinning" : ""} />
            Refresh
          </button>
          <button 
            className="export-btn"
            onClick={handleExport}
            disabled={exporting}
          >
            <FaDownload />
            {exporting ? 'Exporting...' : 'Export Data'}
          </button>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="time-filter">
        <FaFilter className="filter-icon" />
        <div className="filter-options">
          {['day', 'week', 'month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              className={`filter-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">{stat.icon}</div>
                  <span className="trend-indicator">
                    {getTrendIcon(stat.trend)}
                    <span className={`trend-text ${stat.trend}`}>
                      {stat.change}
                    </span>
                  </span>
                </div>
                <h3>{stat.value.toLocaleString()}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-container">
              <div className="chart-header">
                <h3>User Growth & Meetings</h3>
                <span className="chart-subtitle">Last 6 months</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="meetings" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <div className="chart-header">
                <h3>Meeting Types Distribution</h3>
                <span className="chart-subtitle">By category</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bar-chart-container">
            <div className="chart-header">
              <h3>Monthly Performance</h3>
              <span className="chart-subtitle">Comparison metrics</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#2563eb" name="Users" />
                <Bar dataKey="meetings" fill="#10b981" name="Meetings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tables Section */}
          <div className="tables-section">
            {/* Recent Activities */}
            <div className="table-container">
              <div className="table-header">
                <h3><FaTable /> Recent Activities</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <table className="activities-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="user-cell">
                        <div className="user-avatar">
                          {activity.user.charAt(0)}
                        </div>
                        {activity.user}
                      </td>
                      <td>{activity.action}</td>
                      <td>{activity.time}</td>
                      <td>
                        <span className={`status-badge ${activity.status}`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Users */}
            <div className="table-container">
              <div className="table-header">
                <h3><FaUsers /> Top Users</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="users-list">
                {topUsers.map((user) => (
                  <div key={user.id} className="user-item">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-stats">
                          <span>{user.meetings} meetings</span>
                          <span>•</span>
                          <span>{user.messages} messages</span>
                        </div>
                      </div>
                    </div>
                    <div className="user-score">
                      <div className="score-label">Score</div>
                      <div className="score-value">
                        {Math.round((user.meetings * 2 + user.messages * 0.5))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="metrics-section">
            <h3>Performance Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <h4>Response Time</h4>
                  <FaExclamationTriangle className="warning-icon" />
                </div>
                <div className="metric-value">1.2s</div>
                <div className="metric-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '85%' }}></div>
                  </div>
                  <span className="progress-text">85% within target</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <h4>Uptime</h4>
                  <span className="status-dot success"></span>
                </div>
                <div className="metric-value">99.9%</div>
                <div className="metric-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '99.9%' }}></div>
                  </div>
                  <span className="progress-text">Last 30 days</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <h4>Error Rate</h4>
                  <span className="status-dot error"></span>
                </div>
                <div className="metric-value">0.8%</div>
                <div className="metric-progress">
                  <div className="progress-bar">
                    <div className="progress-fill error" style={{ width: '0.8%' }}></div>
                  </div>
                  <span className="progress-text">Below threshold</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;