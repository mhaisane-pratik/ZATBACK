import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { 
  FiVideo, FiMessageSquare, FiSettings, FiHome, FiCalendar, FiBell, 
  FiSun, FiMoon, FiMenu, FiUsers, FiClock, FiSearch, FiMail,
  FiChevronRight, FiPlay, FiDownload, FiFileText, FiBarChart2, FiTrendingUp,
  FiShield, FiZap, FiCloud, FiMusic, FiFilm, FiHeadphones, FiUserPlus,
  FiShare2, FiEdit, FiStar, FiGrid, FiActivity, FiMic, FiMicOff, FiCamera,
  FiUserCheck, FiLink, FiClock as FiClockIcon, FiVideoOff, FiUsers as FiUsersIcon,
  FiCheck, FiX, FiCpu, FiGlobe, FiServer, FiChevronDown, FiChevronLeft,
  FiPlus, FiMoreVertical, FiRefreshCw, FiPieChart, FiTarget, FiAward,
  FiSmartphone, FiMonitor, FiTablet, FiRadio, FiVolume2, FiMaximize2,
  FiMinimize2, FiHelpCircle, FiInfo, FiExternalLink, FiUpload,
  FiBookOpen, FiCode, FiDatabase, FiWifi, FiWifiOff, FiShuffle,
  FiLayers, FiPackage, FiTool, FiFilter, FiEye, FiEyeOff,
  FiAlertCircle, FiCheckCircle, FiAlertTriangle, FiThumbsUp,
  FiGitBranch, FiCpu as FiCpuIcon, FiHardDrive, FiTerminal,
  FiCommand, FiHash, FiPercent, FiTrendingDown, FiCalendar as FiCalendarIcon,
  FiLogOut // Added logout icon
} from "react-icons/fi";
import { BsCalendarEvent, BsFileEarmarkPlay, BsCameraVideo, BsThreeDots, BsGraphUp } from "react-icons/bs";
import { RiTeamLine, RiDashboardFill, RiShieldKeyholeLine, RiCloudLine } from "react-icons/ri";
import { FaRegCircle, FaCircle, FaVideo, FaMicrophone, FaRegClock, FaRegStar, FaStar } from "react-icons/fa";
import { TbBrandZoom, TbScreenShare, TbChartArcs, TbWaveSawTool } from "react-icons/tb";
import { MdOutlineHandRaised, MdOutlineClosedCaption, MdOutlineSecurity, MdOutlineWorkspaces } from "react-icons/md";
import { IoStatsChartOutline, IoPeopleOutline, IoVideocamOutline } from "react-icons/io5";
import { GiNetworkBars, GiProgression } from "react-icons/gi";
import { SiSpeedtest } from "react-icons/si";
import StatsCards from "./StatsCards";
import "./dashboard.css";

// Interfaces
interface ChatItem {
  initials: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  color: string;
  status: 'online' | 'offline' | 'away';
}

interface MeetingItem {
  time: string;
  title: string;
  type: string;
  participants?: number;
  duration: string;
}

interface RecordingItem {
  id: number;
  title: string;
  date: string;
  duration: string;
  size: string;
  thumbnail: string;
  views: number;
}

interface ActiveRoom {
  id: number;
  name: string;
  participants: number;
  host: string;
  duration: string;
  type: 'meeting' | 'webinar' | 'training';
  protected: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  avatarColor: string;
  tasks: number;
}

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  icon: JSX.Element;
  status: 'success' | 'warning' | 'info' | 'error';
  userAvatar: string;
}

interface DeviceItem {
  id: number;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  status: 'active' | 'inactive';
  lastActive: string;
  icon: JSX.Element;
}

interface StatItem {
  id: number;
  label: string;
  value: string;
  change: number;
  icon: JSX.Element;
  color: string;
}

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  enabled: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const CHAT_ID = "24219b0a-35cc-4185-b80d-0adc92b0b643";
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : false;
  });
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Meeting starting soon", time: "5 min ago", unread: true },
    { id: 2, title: "New recording available", time: "1 hour ago", unread: true },
    { id: 3, title: "Storage limit warning", time: "2 hours ago", unread: false },
  ]);
  
  const [activeFeature, setActiveFeature] = useState("Home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [meetingStatus, setMeetingStatus] = useState('idle');
  const [storageUsage, setStorageUsage] = useState(78);
  const [networkQuality, setNetworkQuality] = useState(92);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 18) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';
    document.body.className = themeClass;
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    // Clear any user session data if needed
    localStorage.removeItem("userSession");
    // Redirect to login page
    navigate("/login");
  };

  const features = [
    { icon: <RiDashboardFill />, label: "Dashboard", active: activeFeature === "Dashboard", onClick: () => navigate("/dashboard") },
    { icon: <FiMessageSquare />, label: "Chat", active: activeFeature === "Chat", onClick: () => navigate("/chat-login"), badge: 3 },
    { icon: <FiCalendar />, label: "Calendar", active: activeFeature === "Calendar", onClick: () => navigate("/calendar") },
    { icon: <BsFileEarmarkPlay />, label: "Recordings", active: activeFeature === "Recordings", onClick: () => navigate("/recordings"), badge: 12 },
    { icon: <FiUsers />, label: "Team", active: activeFeature === "Team", onClick: () => navigate("/team") },
    { icon: <FiBarChart2 />, label: "Analytics", active: activeFeature === "Analytics", onClick: () => navigate("/analytics") },
    { icon: <FiSettings />, label: "Settings", active: activeFeature === "Settings", onClick: () => navigate("/settings") },
  ];

  const quickActions = [
    { icon: <FiVideo />, label: "Start Meeting", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", description: "Instant video conference", hotkey: "⌘+M", onClick: () => navigate("/prejoin") },
    { icon: <FiSearch />, label: "Join Meeting", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", description: "Enter meeting code", hotkey: "⌘+J", onClick: () => navigate("/join") },
    { icon: <BsCalendarEvent />, label: "Schedule", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", description: "Plan future meetings", hotkey: "⌘+S", onClick: () => navigate("/schedule") },
    { icon: <FiUserPlus />, label: "Invite", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", description: "Invite participants", hotkey: "⌘+I", onClick: () => navigate("/invite") },
    { icon: <FiFilm />, label: "Record", gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", description: "Start recording", hotkey: "⌘+R", onClick: () => navigate("/record") },
  ];

  const activeRooms: ActiveRoom[] = [
    { id: 1, name: "Product Strategy", participants: 8, host: "Alex Johnson", duration: "25 min", type: 'meeting', protected: true },
    { id: 2, name: "Design Review", participants: 5, host: "Sarah Chen", duration: "15 min", type: 'meeting', protected: false },
    { id: 3, name: "Client Demo", participants: 12, host: "Michael Lee", duration: "40 min", type: 'webinar', protected: true },
    { id: 4, name: "Team Sync", participants: 6, host: "David Kim", duration: "10 min", type: 'meeting', protected: false },
    { id: 5, name: "Training Session", participants: 25, host: "Emma Wilson", duration: "55 min", type: 'training', protected: true },
  ];

  const teamMembers: TeamMember[] = [
    { id: 1, name: "Alex Johnson", role: "Product Manager", status: 'online', avatarColor: "#4F46E5", tasks: 3 },
    { id: 2, name: "Sarah Chen", role: "Lead Designer", status: 'busy', avatarColor: "#10B981", tasks: 5 },
    { id: 3, name: "Marcus Lee", role: "Frontend Dev", status: 'online', avatarColor: "#8B5CF6", tasks: 2 },
    { id: 4, name: "Priya Sharma", role: "Backend Dev", status: 'away', avatarColor: "#F59E0B", tasks: 4 },
    { id: 5, name: "David Kim", role: "QA Engineer", status: 'online', avatarColor: "#EF4444", tasks: 1 },
    { id: 6, name: "Emma Wilson", role: "Marketing Lead", status: 'offline', avatarColor: "#EC4899", tasks: 0 },
  ];

  const upcomingMeetings: MeetingItem[] = [
    { time: "3:15 PM", title: "Product Strategy Review", type: "Video Call", participants: 8, duration: "45 mins" },
    { time: "4:30 PM", title: "Client Presentation", type: "External Call", participants: 3, duration: "30 mins" },
    { time: "5:00 PM", title: "Team Sync", type: "Internal Meeting", participants: 12, duration: "30 mins" },
    { time: "6:00 PM", title: "Board Meeting", type: "Conference", participants: 15, duration: "60 mins" },
  ];

  const activities: ActivityItem[] = [
    { id: 1, user: "Sarah Chen", action: "uploaded a new recording", target: "Design_Sprint_Oct.mp4", time: "12m ago", icon: <FiCloud />, status: 'info', userAvatar: "SC" },
    { id: 2, user: "Alex Johnson", action: "started a meeting in", target: "Alpha Launch", time: "45m ago", icon: <FiPlay />, status: 'success', userAvatar: "AJ" },
    { id: 3, user: "System", action: "performed weekly cleanup", target: "Server Node 04", time: "2h ago", icon: <FiServer />, status: 'warning', userAvatar: "SYS" },
    { id: 4, user: "Marcus Lee", action: "shared screen in", target: "Design Review", time: "3h ago", icon: <TbScreenShare />, status: 'info', userAvatar: "ML" },
    { id: 5, user: "David Kim", action: "completed recording of", target: "Q4 Planning", time: "5h ago", icon: <FiCheckCircle />, status: 'success', userAvatar: "DK" },
    { id: 6, user: "Emma Wilson", action: "added new team member to", target: "Marketing Team", time: "1d ago", icon: <FiUserPlus />, status: 'info', userAvatar: "EW" },
    { id: 7, user: "System", action: "updated security settings for", target: "All meetings", time: "2d ago", icon: <FiShield />, status: 'warning', userAvatar: "SYS" },
  ];

  const recordings: RecordingItem[] = [
    { id: 1, title: 'Q4 Planning Session', date: 'Oct 24, 2024', duration: '45:22', size: '245 MB', thumbnail: '📊', views: 42 },
    { id: 2, title: 'Product Launch Review', date: 'Oct 22, 2024', duration: '32:18', size: '180 MB', thumbnail: '🚀', views: 28 },
    { id: 3, title: 'Team Building Workshop', date: 'Oct 20, 2024', duration: '58:45', size: '320 MB', thumbnail: '👥', views: 15 },
    { id: 4, title: 'Marketing Strategy 2024', date: 'Oct 18, 2024', duration: '1:22:10', size: '450 MB', thumbnail: '🎯', views: 36 },
    { id: 5, title: 'Technical Training: React', date: 'Oct 15, 2024', duration: '2:05:30', size: '620 MB', thumbnail: '⚛️', views: 52 },
  ];

  const devices: DeviceItem[] = [
    { id: 1, name: "MacBook Pro", type: 'desktop', status: 'active', lastActive: "Now", icon: <FiMonitor /> },
    { id: 2, name: "iPhone 13", type: 'mobile', status: 'active', lastActive: "2 min ago", icon: <FiSmartphone /> },
    { id: 3, name: "iPad Air", type: 'tablet', status: 'inactive', lastActive: "3 days ago", icon: <FiTablet /> },
    { id: 4, name: "Windows Desktop", type: 'desktop', status: 'active', lastActive: "1 hour ago", icon: <FiMonitor /> },
  ];

  const stats: StatItem[] = [
    { id: 1, label: "Meeting Hours", value: "124.5", change: +12.5, icon: <FiClock />, color: "#4F46E5" },
    { id: 2, label: "Active Participants", value: "342", change: +8.2, icon: <FiUsers />, color: "#10B981" },
    { id: 3, label: "Storage Used", value: "78%", change: +5.3, icon: <FiHardDrive />, color: "#F59E0B" },
    { id: 4, label: "Network Quality", value: "92%", change: +2.1, icon: <GiNetworkBars />, color: "#8B5CF6" },
  ];

  const platformFeatures: FeatureItem[] = [
    { id: 1, title: "AI Transcription", description: "Real-time speech to text", icon: <FiMic />, enabled: true },
    { id: 2, title: "Breakout Rooms", description: "Create smaller discussion groups", icon: <FiUsers />, enabled: true },
    { id: 3, title: "Virtual Background", description: "Blur or replace background", icon: <FiCamera />, enabled: true },
    { id: 4, title: "Polling & Surveys", description: "Interactive audience polls", icon: <FiBarChart2 />, enabled: false },
    { id: 5, title: "Live Translation", description: "Real-time language translation", icon: <FiGlobe />, enabled: false },
    { id: 6, title: "Meeting Analytics", description: "Detailed participation metrics", icon: <FiActivity />, enabled: true },
  ];

  const popularIntegrations = [
    { id: 1, name: "Google Calendar", icon: <FiCalendar />, connected: true },
    { id: 2, name: "Slack", icon: <FiMessageSquare />, connected: true },
    { id: 3, name: "Microsoft Teams", icon: <FiUsers />, connected: false },
    { id: 4, name: "Zoom", icon: <TbBrandZoom />, connected: true },
    { id: 5, name: "Dropbox", icon: <FiCloud />, connected: false },
    { id: 6, name: "Notion", icon: <FiFileText />, connected: true },
  ];

  const handleJoinMeeting = (roomId: number) => {
    setMeetingStatus('joining');
    setTimeout(() => {
      setMeetingStatus('active');
      navigate(`/meeting/${roomId}`);
    }, 1500);
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;

  return (
    <div className={`dashboard-app ${isDarkMode ? 'dark-theme' : 'light-theme'} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <div className="logo-animation">
                <BsCameraVideo size={22} />
                <div className="pulse-ring"></div>
              </div>
            </div>
            {!sidebarCollapsed && (
              <>
                <h1 className="sidebar-logo">ZAT<span className="logo-highlight">Video</span></h1>
                <div className="version-badge">v2.4</div>
              </>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="workspace-badge">
              <div className="workspace-status active"></div>
              <span>Professional</span>
              <FiChevronDown className="dropdown-arrow" />
            </div>
          )}
        </div>

        {/* Scrollable sidebar content */}
        <div className="sidebar-scrollable">
          <nav className="sidebar-nav">
            {features.map((f, i) => (
              <button key={i} className={`nav-btn ${f.active ? 'active' : ''}`} onClick={() => {setActiveFeature(f.label); f.onClick();}}>
                <span className="nav-icon-wrapper">
                  {f.icon}
                  {f.badge && <span className="nav-badge">{f.badge}</span>}
                </span>
                {!sidebarCollapsed && (
                  <div className="nav-content">
                    <span className="nav-label">{f.label}</span>
                    {f.badge && <span className="nav-badge-label">{f.badge}</span>}
                  </div>
                )}
              </button>
            ))}
          </nav>

          <div className="sidebar-middle">
            <div className="storage-widget">
              {!sidebarCollapsed && <h4 className="storage-title">Storage</h4>}
              <div className="storage-progress-wrapper">
                <div className="storage-progress">
                  <div className="storage-fill" style={{ width: `${storageUsage}%` }}></div>
                </div>
                {!sidebarCollapsed && (
                  <div className="storage-info">
                    <span>{storageUsage}% used</span>
                    <FiInfo className="info-icon" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="theme-toggle-container">
            <button onClick={toggleTheme} className="theme-toggle-btn">
              <div className="theme-toggle-icon">{isDarkMode ? <FiSun /> : <FiMoon />}</div>
              {!sidebarCollapsed && (
                <div className="theme-toggle-text">
                  <span className="theme-label">Switch Theme</span>
                  <span className="theme-status">{isDarkMode ? 'Dark' : 'Light'}</span>
                </div>
              )}
            </button>
          </div>

          {/* Logout Button */}
          <div className="logout-container">
            <button onClick={handleLogout} className="logout-btn">
              <div className="logout-icon">
                <FiLogOut />
              </div>
              {!sidebarCollapsed && (
                <div className="logout-text">
                  <span className="logout-label">Logout</span>
                </div>
              )}
            </button>
          </div>

          <div className="user-profile">
            <div className="avatar-container">
              <div className="avatar-initials">VT</div>
              <div className="status-indicator online"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="user-info">
                <h4>Verzat Team</h4>
                <p>Pro Plan • v2.4</p>
              </div>
            )}
            <button className="more-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
              <BsThreeDots />
            </button>
          </div>
        </div>
      </aside>

      {/* USER MENU DROPDOWN */}
      {showUserMenu && (
        <div className="user-menu-dropdown" ref={userMenuRef}>
          <div className="user-menu-header">
            <div className="menu-avatar">VT</div>
            <div className="menu-user-info">
              <h4>Verzat Team</h4>
              <p>admin@verzat.com</p>
            </div>
          </div>
          <div className="menu-items">
            <button className="menu-item"><FiUserCheck /> Profile</button>
            <button className="menu-item"><FiSettings /> Settings</button>
            <button className="menu-item"><FiShield /> Security</button>
            <button className="menu-item"><FiHelpCircle /> Help</button>
            <div className="menu-divider"></div>
            <button className="menu-item logout" onClick={handleLogout}>
              <FiLogOut /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              {sidebarCollapsed ? <FiMenu /> : <FiChevronLeft />}
            </button>
            <div className="header-breadcrumb">
              <h2 className="page-title">Dashboard</h2>
              <div className="breadcrumb-trail">
                <span>Home</span>
                <FiChevronRight />
                <span className="active">Overview</span>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="time-greeting">
              <span className="greeting">Good {timeOfDay}, Team!</span>
              <span className="current-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search meetings, recordings, people..." className="search-input" />
              <div className="search-shortcut">⌘K</div>
            </div>
            
            <div className="header-buttons">
              <button className="header-btn" onClick={() => navigate("/calendar")}>
                <FiCalendarIcon />
              </button>
              
              <div className="notification-wrapper" ref={notificationsRef}>
                <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
                  <FiBell />
                  {unreadNotifications > 0 && <span className="notification-badge">{unreadNotifications}</span>}
                </button>
                
                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <h4>Notifications</h4>
                      <button className="mark-all-read">Mark all read</button>
                    </div>
                    <div className="notifications-list">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                          <div className="notification-icon">
                            <FiBell />
                          </div>
                          <div className="notification-content">
                            <p className="notification-title">{notif.title}</p>
                            <span className="notification-time">{notif.time}</span>
                          </div>
                          {notif.unread && <div className="unread-dot"></div>}
                        </div>
                      ))}
                    </div>
                    <button className="view-all-btn">View All Notifications</button>
                  </div>
                )}
              </div>
              
              <button className="new-meeting-btn" onClick={() => navigate("/prejoin")}>
                <FiVideo />
                <span>New Meeting</span>
                <div className="meeting-hotkey">⌘M</div>
              </button>
              
              <button className="quick-action-btn" title="Quick Actions">
                <FiZap />
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-tabs">
          <div className="tabs-container">
            <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <FiGrid /> Overview
            </button>
            <button className={`tab-btn ${activeTab === 'meetings' ? 'active' : ''}`} onClick={() => setActiveTab('meetings')}>
              <FiVideo /> Meetings
            </button>
            <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
              <FiBarChart2 /> Analytics
            </button>
            <button className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
              <FiUsers /> Team
            </button>
            <button className={`tab-btn ${activeTab === 'recordings' ? 'active' : ''}`} onClick={() => setActiveTab('recordings')}>
              <FiFilm /> Recordings
            </button>
          </div>
          <div className="tabs-actions">
            <button className="action-btn"><FiFilter /> Filter</button>
            <button className="action-btn"><FiRefreshCw /> Refresh</button>
            <button className="action-btn primary"><FiPlus /> Create</button>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="welcome-banner">
            <div className="welcome-content">
              <h2>Welcome back, Team! 👋</h2>
              <p>You have {upcomingMeetings.length} meetings scheduled today. Next meeting at 3:15 PM</p>
            </div>
            <div className="welcome-stats">
              <div className="stat-card mini">
                <FiUsers />
                <div><h3>342</h3><p>Active Users</p></div>
              </div>
              <div className="stat-card mini">
                <FiClock />
                <div><h3>124.5h</h3><p>Meeting Time</p></div>
              </div>
            </div>
          </div>

          <section className="quick-actions-section">
            <div className="section-header">
              <div className="section-title-wrapper">
                <h2 className="section-title">Quick Actions</h2>
                <div className="ai-badge"><FiZap /><span>AI Enhanced</span></div>
              </div>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="quick-actions-grid">
              {quickActions.map((action, i) => (
                <button key={i} className="quick-action-card" onClick={action.onClick} style={{ background: action.gradient }}>
                  <div className="action-icon-wrapper">
                    {action.icon}
                    <div className="action-hotkey">{action.hotkey}</div>
                  </div>
                  <div className="action-content">
                    <h3>{action.label}</h3>
                    <p>{action.description}</p>
                  </div>
                  <FiChevronRight className="action-arrow" />
                  <div className="action-hover-effect"></div>
                </button>
              ))}
            </div>
          </section>

          <section className="stats-overview">
            <div className="stats-grid">
              {stats.map(stat => (
                <div key={stat.id} className="stat-card-large">
                  <div className="stat-header">
                    <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>{stat.icon}</div>
                    <div className="stat-change" style={{ color: stat.change >= 0 ? '#10B981' : '#EF4444' }}>
                      {stat.change >= 0 ? '+' : ''}{stat.change}%
                    </div>
                  </div>
                  <div className="stat-content">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                  <div className="stat-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(100, Math.abs(stat.change) * 5)}%`, backgroundColor: stat.color }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="dashboard-main-grid">
            <div className="dashboard-left-column">
              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-title-wrapper">
                    <h3><FiCalendar /> Upcoming Meetings</h3>
                    <span className="card-badge">{upcomingMeetings.length}</span>
                  </div>
                </div>
                <div className="next-meeting-highlight">
                  <div className="meeting-time">
                    <div className="time-badge">3:15 PM</div>
                    <div className="time-remaining">Starts in 45 min</div>
                  </div>
                  <div className="meeting-details">
                    <h4>Product Strategy Review</h4>
                    <div className="meeting-meta">
                      <span><FiUsers /> 8 Participants</span>
                      <span><FiClock /> 45 mins</span>
                    </div>
                  </div>
                  <button className="join-now-btn" onClick={() => handleJoinMeeting(1)}>
                    {meetingStatus === 'joining' ? 'Joining...' : 'Join Now'}
                    <FiChevronRight />
                  </button>
                </div>
                
                <div className="meetings-list">
                  {upcomingMeetings.slice(1).map((meeting, index) => (
                    <div key={index} className="meeting-item">
                      <div className="meeting-time-small">{meeting.time}</div>
                      <div className="meeting-info">
                        <h5>{meeting.title}</h5>
                        <p>{meeting.type} • {meeting.duration}</p>
                      </div>
                      <button className="join-btn-small">Join</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-title-wrapper">
                    <h3><FiActivity /> Active Rooms</h3>
                    <div className="live-indicator">
                      <div className="pulse-dot"></div>
                      <span>Live Now</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="card-action-btn" title="Refresh">
                      <FiRefreshCw />
                    </button>
                    <button className="card-action-btn" title="More">
                      <FiMoreVertical />
                    </button>
                  </div>
                </div>
                
                <div className="rooms-scroll-container">
                  <div className="rooms-list">
                    {activeRooms.map(room => (
                      <div key={room.id} className="room-item">
                        <div className="room-header">
                          <span className="room-type">{room.type}</span>
                          {room.protected && <FiShield className="protected-icon" />}
                        </div>
                        <div className="room-content">
                          <h4>{room.name}</h4>
                          <div className="room-meta">
                            <span><FiUsers /> {room.participants} participants</span>
                            <span><FiClock /> {room.duration}</span>
                            <span>Host: <span className="host">{room.host}</span></span>
                          </div>
                        </div>
                        <button className="join-room-btn" onClick={() => handleJoinMeeting(room.id)}>
                          <FiVideo /> Join Room
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-title-wrapper">
                    <h3><FiFilm /> Recent Recordings</h3>
                  </div>
                  <button className="view-all-btn">View All</button>
                </div>
                
                <div className="recordings-list">
                  {recordings.map(recording => (
                    <div key={recording.id} className="recording-item">
                      <div className="recording-thumbnail">
                        {recording.thumbnail}
                        <div className="play-overlay">
                          <FiPlay />
                        </div>
                      </div>
                      <div className="recording-info">
                        <h5>{recording.title}</h5>
                        <div className="recording-meta">
                          <span><FiCalendarIcon /> {recording.date}</span>
                          <span><FiClock /> {recording.duration}</span>
                          <span><FiEye /> {recording.views} views</span>
                        </div>
                      </div>
                      <button className="recording-action-btn" title="Download">
                        <FiDownload />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dashboard-right-column">
              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-title-wrapper">
                    <h3><RiTeamLine /> Team Status</h3>
                    <button className="invite-btn">
                      <FiUserPlus /> Invite
                    </button>
                  </div>
                </div>
                
                <div className="team-members">
                  {teamMembers.map(member => (
                    <div key={member.id} className="team-member-card">
                      <div className="member-avatar-wrapper">
                        <div className="member-avatar" style={{ background: member.avatarColor }}>
                          {member.name[0]}
                        </div>
                        <div className={`member-status ${member.status}`}></div>
                        {member.tasks > 0 && <div className="task-badge">{member.tasks}</div>}
                      </div>
                      <div className="member-info">
                        <h4>{member.name}</h4>
                        <p>{member.role}</p>
                      </div>
                      <div className="member-actions">
                        <button className="member-action-btn" title="Message">
                          <FiMessageSquare />
                        </button>
                        <button className="member-action-btn" title="Call">
                          <FiVideo />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="team-stats">
                  <div className="team-stat">
                    <span className="stat-label">Online</span>
                    <span className="stat-value">4/6</span>
                  </div>
                  <div className="team-stat">
                    <span className="stat-label">In Meetings</span>
                    <span className="stat-value">2</span>
                  </div>
                  <div className="team-stat">
                    <span className="stat-label">Available</span>
                    <span className="stat-value">3</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-title-wrapper">
                    <h3><FiWifi /> Connected Devices</h3>
                    <div className="connection-status">
                      <FiWifi className="wifi-icon" />
                      <span>Connected</span>
                    </div>
                  </div>
                </div>
                
                <div className="devices-list">
                  {devices.map(device => (
                    <div key={device.id} className="device-item">
                      <div className="device-icon">
                        {device.icon}
                      </div>
                      <div className="device-info">
                        <h5>{device.name}</h5>
                        <p className={`device-status ${device.status}`}>
                          {device.status === 'active' && <span className="active-indicator"></span>}
                          {device.status === 'active' ? 'Active' : 'Inactive'}
                        </p>
                        <span className="last-active">Last active: {device.lastActive}</span>
                      </div>
                      <button className="connect-btn">
                        {device.status === 'active' ? 'Manage' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-title-wrapper">
                    <h3><FiActivity /> System Health</h3>
                  </div>
                  <div className="health-score">
                    <span className="score-value">92%</span>
                    <span className="score-label">Good</span>
                  </div>
                </div>
                
                <div className="health-metrics">
                  <div className="metric">
                    <div className="metric-header">
                      <span className="metric-title"><FiServer /> CPU Usage</span>
                      <span className="metric-value green">24%</span>
                    </div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{width: '24%'}}></div>
                    </div>
                  </div>
                  <div className="metric">
                    <div className="metric-header">
                      <span className="metric-title"><FiDatabase /> Memory</span>
                      <span className="metric-value green">68%</span>
                    </div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{width: '68%'}}></div>
                    </div>
                  </div>
                  <div className="metric">
                    <div className="metric-header">
                      <span className="metric-title"><FiHardDrive /> Storage</span>
                      <span className="metric-value warning">78%</span>
                    </div>
                    <div className="metric-bar">
                      <div className="metric-fill storage" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  <div className="metric">
                    <div className="metric-header">
                      <span className="metric-title"><FiWifi /> Network</span>
                      <span className="metric-value green">92%</span>
                    </div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{width: '92%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="health-actions">
                  <button className="health-action-btn">
                    <FiActivity /> Run Diagnostics
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-bottom-grid">
            <div className="dashboard-card wide">
              <div className="card-header">
                <div className="card-title-wrapper">
                  <h3><FiActivity /> Recent Activity</h3>
                </div>
                <div className="time-filter">
                  <select className="filter-select">
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
              </div>
              
              <div className="activity-timeline">
                {activities.map(activity => (
                  <div key={activity.id} className="timeline-item">
                    <div className="timeline-marker">
                      <div className={`marker-icon ${activity.status}`}>
                        {activity.icon}
                      </div>
                      <div className="timeline-line"></div>
                    </div>
                    <div className="timeline-content">
                      <div className="activity-user">
                        <div className="activity-avatar">
                          {activity.userAvatar}
                        </div>
                        <div className="user-info">
                          <strong>{activity.user}</strong>
                          <span className="activity-time">{activity.time}</span>
                        </div>
                      </div>
                      <p className="activity-text">
                        {activity.action} <span className="activity-target">{activity.target}</span>
                      </p>
                      <div className="activity-actions">
                        <button className="activity-action-btn" title="View">
                          <FiEye />
                        </button>
                        <button className="activity-action-btn" title="Share">
                          <FiShare2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="dashboard-right-bottom">
              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-title-wrapper">
                    <h3><FiLayers /> Platform Features</h3>
                  </div>
                  <span className="card-badge">{platformFeatures.filter(f => f.enabled).length}/{platformFeatures.length}</span>
                </div>
                
                <div className="features-grid">
                  {platformFeatures.map(feature => (
                    <div key={feature.id} className="feature-item">
                      <div className="feature-icon">
                        {feature.icon}
                      </div>
                      <div className="feature-info">
                        <h5>{feature.title}</h5>
                        <p>{feature.description}</p>
                      </div>
                      <div className={`feature-toggle ${feature.enabled ? 'enabled' : 'disabled'}`}>
                        <div className="toggle-switch">
                          <div className="toggle-slider"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ai-assistant-widget">
                <div className="ai-header">
                  <div className="ai-title">
                    <FiZap className="ai-icon" />
                    <h3>AI Assistant</h3>
                    <span className="beta-badge">Beta</span>
                  </div>
                  <button className="ai-settings-btn">
                    <FiSettings />
                  </button>
                </div>
                <div className="ai-content">
                  <p>Your AI assistant can help optimize meeting times, suggest participants, and provide analytics insights.</p>
                  <div className="ai-actions">
                    <button className="ai-action-btn">
                      <FiCalendar /> Schedule Meeting
                    </button>
                    <button className="ai-action-btn">
                      <FiBarChart2 /> Get Insights
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-title-wrapper">
                <h3><FiPackage /> Integrations</h3>
              </div>
              <button className="view-all-btn">Manage All</button>
            </div>
            
            <div className="integrations-grid">
              {popularIntegrations.map(integration => (
                <div key={integration.id} className="integration-item">
                  <div className="integration-icon">
                    {integration.icon}
                  </div>
                  <div className="integration-info">
                    <h5>{integration.name}</h5>
                    <div className={`integration-status ${integration.connected ? 'connected' : 'disconnected'}`}>
                      {integration.connected ? 'Connected' : 'Not Connected'}
                    </div>
                  </div>
                  <button className={`integration-btn ${integration.connected ? 'connected' : ''}`}>
                    {integration.connected ? 'Manage' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-left">
              <span>© 2024 ZAT Video. All rights reserved.</span>
              <div className="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Support</a>
                <a href="#">Documentation</a>
              </div>
            </div>
            <div className="footer-right">
              <span className="system-status">
                <div className="status-dot online"></div>
                Operational
              </span>
              <span className="version">v2.4.1</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}