import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!username.trim()) return;
    setIsLoading(true);
    localStorage.setItem("username", username);
    
    // Simulate network delay for better UX
    setTimeout(() => {
      window.location.href = "/chat";
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && username.trim()) {
      handleLogin();
    }
  };

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="login-container">
      {/* Home Button */}
      <button className="home-button" onClick={goToDashboard} aria-label="Go to Dashboard">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </button>

      <div className="particles" id="particles-js"></div>
      
      {/* Floating Animation Container */}
      <div className="float-container">
        <div className="zat-logo">Z!</div>
        <h1 className="main-title">
          <span className="title-gradient">Zat Room</span>
        </h1>
        <div className="tagline">Anonymous Group Chat</div>
      </div>

      {/* Glassmorphism Card */}
      <div className="login-card">
        <div className="card-header">
          <div className="avatar-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <p className="welcome-text">Choose your identity to enter</p>
        </div>
        
        <div className={`input-container ${isFocused ? 'focused' : ''}`}>
          <input
            className="login-input"
            placeholder="Type your nickname..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="input-glow"></div>
        </div>

        <button 
          className={`login-button ${isLoading ? 'loading' : ''}`} 
          onClick={handleLogin}
          disabled={!username.trim() || isLoading}
        >
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <>
              <span>Join Room</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </>
          )}
        </button>

        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <span>Secure</span>
          </div>
          <div className="feature">
            <div className="feature-icon">👤</div>
            <span>Anonymous</span>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <span>Fast</span>
          </div>
        </div>

        <div className="room-stats">
          <div className="stat">
            <span className="stat-number">128</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">24</span>
            <span className="stat-label">Rooms Open</span>
          </div>
        </div>
      </div>
    </div>
  );
}