import React, { useEffect, useState, useCallback } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  isSameDay, 
  parseISO, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  addMonths, 
  subMonths,
  addDays,
  subDays,
  isToday,
  startOfDay,
  endOfDay,
  differenceInMinutes
} from "date-fns";
import { calendarApi } from "./calendar.api";
import CalendarForm from "./CalendarForm";
import "./Calendar.css";

// Default colors for events
const DEFAULT_COLORS = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", 
  "#EC4899", "#14B8A6", "#84CC16", "#F97316", "#6366F1"
];

interface Meeting {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  color?: string;
  meeting_link?: string;
  location?: string;
  participants?: string[];
}

export default function Calendar() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Meeting | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await calendarApi.getMeetings(
        format(startOfDay(startOfMonth(currentMonth)), "yyyy-MM-dd'T'HH:mm:ss"),
        format(endOfDay(endOfMonth(currentMonth)), "yyyy-MM-dd'T'HH:mm:ss")
      );
      setMeetings(data.map((meeting: Meeting) => ({
        ...meeting,
        color: meeting.color || DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]
      })));
    } catch (e) { 
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => { 
    loadData(); 
  }, [loadData]);

  const handleSave = async (payload: any) => {
    try {
      if (editingEvent) {
        await calendarApi.update(editingEvent.id, payload);
      } else {
        await calendarApi.create(payload);
      }
      setFormOpen(false);
      setEditingEvent(null);
      loadData();
    } catch (e) { 
      alert("Error saving event. Please try again.");
      console.error("Save error:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      try {
        await calendarApi.delete(id);
        loadData();
      } catch (e) {
        alert("Error deleting event");
      }
    }
  };

  const handleQuickAdd = (hours: number) => {
    const startTime = new Date(selectedDate);
    startTime.setHours(startTime.getHours() + hours, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    setEditingEvent({
      id: Date.now().toString(),
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      title: "Quick Meeting",
      description: "",
      color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]
    });
    setFormOpen(true);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  // Generate calendar days based on view mode
  const getCalendarDays = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
    
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentMonth)),
      end: endOfWeek(endOfMonth(currentMonth)),
    });
  };

  const calendarDays = getCalendarDays();
  
  // Filter and search meetings
  const filteredMeetings = meetings.filter(m => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      m.title?.toLowerCase().includes(searchLower) ||
      m.description?.toLowerCase().includes(searchLower) ||
      m.location?.toLowerCase().includes(searchLower)
    );
  });

  const selectedDateMeetings = filteredMeetings.filter(m => 
    isSameDay(parseISO(m.start_time), selectedDate)
  );

  // Group meetings by time for the selected day
  const meetingsByTime = selectedDateMeetings.reduce((acc: Record<string, Meeting[]>, meeting) => {
    const hour = format(parseISO(meeting.start_time), "ha");
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(meeting);
    return acc;
  }, {});

  // Calculate daily stats
  const dailyStats = {
    total: selectedDateMeetings.length,
    duration: selectedDateMeetings.reduce((total, meeting) => {
      const start = parseISO(meeting.start_time);
      const end = parseISO(meeting.end_time);
      return total + differenceInMinutes(end, start);
    }, 0)
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            setEditingEvent(null);
            setFormOpen(true);
            break;
          case 't':
            e.preventDefault();
            goToToday();
            break;
          case 'arrowleft':
            e.preventDefault();
            setCurrentMonth(subMonths(currentMonth, 1));
            break;
          case 'arrowright':
            e.preventDefault();
            setCurrentMonth(addMonths(currentMonth, 1));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMonth]);

  return (
    <div className="calendar-page">
      {/* Header */}
      <header className="top-bar">
        <div className="header-left">
          <button 
            className="home-btn"
            onClick={goToHome}
            title="Go back to home"
          >
            <span className="home-icon">🏠</span> Home
          </button>
          <h1>Calendar</h1>
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button 
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
          </div>
        </div>
        
        <div className="header-center">
          <div className="month-nav">
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="nav-arrow"
              title="Previous month"
            >
              ◀
            </button>
            <span className="current-date">
              {viewMode === 'month' 
                ? format(currentMonth, "MMMM yyyy")
                : `${format(startOfWeek(selectedDate), 'MMM d')} - ${format(endOfWeek(selectedDate), 'MMM d, yyyy')}`
              }
            </span>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="nav-arrow"
              title="Next month"
            >
              ▶
            </button>
            <button 
              className="today-btn"
              onClick={goToToday}
            >
              Today
            </button>
          </div>
        </div>
        
        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button 
            className="schedule-btn primary"
            onClick={() => { setEditingEvent(null); setFormOpen(true); }}
            title="Schedule new meeting (Ctrl+N)"
          >
            <span className="btn-icon">+</span> Schedule Meeting
          </button>
          <button 
            className="quick-add-btn"
            onClick={() => handleQuickAdd(1)}
            title="Quick add meeting"
          >
            Quick Add
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total Events</span>
          <span className="stat-value">{meetings.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Today's Events</span>
          <span className="stat-value">{selectedDateMeetings.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Today's Duration</span>
          <span className="stat-value">{Math.round(dailyStats.duration / 60)}h</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">View Mode</span>
          <span className="stat-value badge">{viewMode}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="layout">
        <main className="calendar-box">
          <div className="calendar-header">
            <div className="weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="weekday-label">{d}</div>
              ))}
            </div>
          </div>
          
          <div className="days-container">
            <div className="days-grid">
              {loading ? (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                  <p>Loading calendar...</p>
                </div>
              ) : (
                calendarDays.map(day => {
                  const dayEvents = filteredMeetings.filter(m => isSameDay(parseISO(m.start_time), day));
                  const isCurrentDay = isToday(day);
                  const isSelectedDay = isSameDay(day, selectedDate);
                  const isCurrentMonthDay = isSameMonth(day, currentMonth);
                  const isWeekend = [0, 6].includes(day.getDay());

                  return (
                    <div 
                      key={day.toString()} 
                      className={`day-cell 
                        ${!isCurrentMonthDay ? "other-month" : ""} 
                        ${isSelectedDay ? "selected" : ""} 
                        ${isCurrentDay ? "today" : ""}
                        ${isWeekend ? "weekend" : ""}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="day-header">
                        <span className="day-num">{format(day, "d")}</span>
                        {isCurrentDay && <span className="today-badge">Today</span>}
                      </div>
                      
                      <div className="events-container">
                        {dayEvents.slice(0, 3).map(event => (
                          <div 
                            key={event.id} 
                            className="event-preview"
                            style={{ 
                              backgroundColor: `${event.color}20`,
                              borderLeft: `3px solid ${event.color}`
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEvent(event);
                              setFormOpen(true);
                            }}
                          >
                            <span className="event-time">
                              {format(parseISO(event.start_time), "HH:mm")}
                            </span>
                            <span className="event-title" title={event.title}>
                              {event.title}
                            </span>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="more-events">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>

        {/* Side Panel */}
        <aside className={`side-panel ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="panel-header">
            <div className="date-header">
              <h3>{format(selectedDate, "EEEE, MMMM do")}</h3>
              <button 
                className="collapse-btn"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? "Expand panel" : "Collapse panel"}
              >
                {sidebarCollapsed ? '▶' : '◀'}
              </button>
            </div>
            <div className="day-stats">
              <span className="event-count">
                {selectedDateMeetings.length} events • {Math.round(dailyStats.duration / 60)} hours
              </span>
              <button 
                className="add-to-day-btn"
                onClick={() => {
                  setEditingEvent(null);
                  setFormOpen(true);
                }}
              >
                + Add to this day
              </button>
            </div>
          </div>

          {!sidebarCollapsed && (
            <>
              <div className="panel-actions">
                <button 
                  className="icon-btn"
                  onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                  title="Previous day"
                >
                  ◀
                </button>
                <button 
                  className="icon-btn today-small"
                  onClick={goToToday}
                >
                  Today
                </button>
                <button 
                  className="icon-btn"
                  onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                  title="Next day"
                >
                  ▶
                </button>
              </div>

              <div className="event-list">
                {selectedDateMeetings.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h4>No meetings scheduled</h4>
                    <p>Add a meeting or use Quick Add</p>
                    <button 
                      className="empty-action-btn"
                      onClick={() => {
                        setEditingEvent(null);
                        setFormOpen(true);
                      }}
                    >
                      Schedule your first meeting
                    </button>
                  </div>
                ) : (
                  <div className="time-slots-container">
                    {Object.entries(meetingsByTime).map(([time, timeMeetings]) => (
                      <div key={time} className="time-slot">
                        <div className="time-label">{time}</div>
                        <div className="time-events">
                          {timeMeetings.map(m => (
                            <div key={m.id} className="meeting-card" style={{ borderLeftColor: m.color }}>
                              <div className="card-header">
                                <span className="card-time">
                                  {format(parseISO(m.start_time), "hh:mm a")} - {format(parseISO(m.end_time), "hh:mm a")}
                                </span>
                                <span className="card-duration">
                                  {differenceInMinutes(parseISO(m.end_time), parseISO(m.start_time))}min
                                </span>
                              </div>
                              <div className="card-body">
                                <h4 className="card-title">{m.title}</h4>
                                {m.description && (
                                  <p className="description">{m.description}</p>
                                )}
                                {m.location && (
                                  <div className="card-meta">
                                    <span className="location">📍 {m.location}</span>
                                  </div>
                                )}
                              </div>
                              <div className="card-footer">
                                {m.meeting_link && (
                                  <a 
                                    href={m.meeting_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="join-btn"
                                  >
                                    🔗 Join Call
                                  </a>
                                )}
                                <div className="card-actions">
                                  <button 
                                    className="edit-btn"
                                    onClick={() => { setEditingEvent(m); setFormOpen(true); }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="delete-btn"
                                    onClick={() => handleDelete(m.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => { setFormOpen(false); setEditingEvent(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CalendarForm 
              open={isFormOpen} 
              editEvent={editingEvent} 
              selectedDate={format(selectedDate, "yyyy-MM-dd")} 
              onClose={() => {
                setFormOpen(false);
                setEditingEvent(null);
              }} 
              onSave={handleSave} 
              colors={DEFAULT_COLORS}
            />
          </div>
        </div>
      )}

      {/* Quick Add Floating Button */}
      <button 
        className="floating-action-btn"
        onClick={() => handleQuickAdd(1)}
        title="Quick Add Meeting (1 hour from now)"
      >
        +
      </button>

      {/* Keyboard Shortcuts Help */}
      <div className="shortcut-hint">
        <span className="hint-text">Press Ctrl+N to schedule meeting, Ctrl+T for today</span>
      </div>
    </div>
  );
}