import React, { useState, useEffect } from "react";

export default function CalendarForm({ open, onClose, onSave, selectedDate, editEvent, colors }: any) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    meeting_link: "",
    color: colors?.[0] || "#2563eb"
  });

  useEffect(() => {
    if (editEvent) {
      setFormData({
        title: editEvent.title || "",
        description: editEvent.description || "",
        start_time: editEvent.start_time?.slice(0, 16) || "",
        end_time: editEvent.end_time?.slice(0, 16) || "",
        location: editEvent.location || "",
        meeting_link: editEvent.meeting_link || "",
        color: editEvent.color || colors?.[0] || "#2563eb"
      });
    } else {
      const now = new Date();
      const startTime = new Date(now);
      startTime.setHours(9, 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(10, 0, 0, 0);
      
      setFormData({
        title: "",
        description: "",
        start_time: formatDateTime(startTime),
        end_time: formatDateTime(endTime),
        location: "",
        meeting_link: "",
        color: colors?.[0] || "#2563eb"
      });
    }
  }, [editEvent, selectedDate, colors]);

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editEvent ? "Edit Meeting" : "New Meeting"}
          </h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              Title *
              <input 
                className="form-input"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="Meeting title"
                required 
              />
            </label>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Description
              <textarea 
                className="form-textarea"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Add meeting details"
                rows={3}
              />
            </label>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Start Time *
                <input 
                  type="datetime-local" 
                  className="form-input"
                  value={formData.start_time} 
                  onChange={e => setFormData({...formData, start_time: e.target.value})} 
                  required 
                />
              </label>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                End Time *
                <input 
                  type="datetime-local" 
                  className="form-input"
                  value={formData.end_time} 
                  onChange={e => setFormData({...formData, end_time: e.target.value})} 
                  required 
                />
              </label>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Location
                <input 
                  className="form-input"
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  placeholder="Office, Zoom, etc."
                />
              </label>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Meeting Link
                <input 
                  className="form-input"
                  type="url"
                  value={formData.meeting_link} 
                  onChange={e => setFormData({...formData, meeting_link: e.target.value})} 
                  placeholder="https://meet.google.com/..."
                />
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Color
              <div className="color-picker">
                {colors?.map((color: string) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({...formData, color})}
                    aria-label={`Select color ${color}`}
                  >
                    {formData.color === color && (
                      <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </label>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              {editEvent ? "Update Meeting" : "Create Meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}