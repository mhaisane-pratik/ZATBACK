import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PreJoin() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestPermissions();
    return () => stopStream();
  }, []);

  const requestPermissions = async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError("");
    } catch (err: any) {
      setError(err.name === "NotFoundError" 
        ? "No camera or microphone found" 
        : "Camera or microphone permission denied");
    } finally {
      setIsLoading(false);
    }
  };

  const stopStream = () => {
    stream?.getTracks().forEach(track => track.stop());
  };

  const toggleCamera = () => {
    stream?.getVideoTracks().forEach(track => {
      track.enabled = !cameraOn;
    });
    setCameraOn(!cameraOn);
  };

  const toggleMic = () => {
    stream?.getAudioTracks().forEach(track => {
      track.enabled = !micOn;
    });
    setMicOn(!micOn);
  };

  const joinMeeting = () => {
    stopStream();
    navigate("/meeting");
  };

  const goToDashboard = () => {
    stopStream();
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      {/* Header with Logo and Home Icon */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>ZATROOM</div>
          <span style={styles.tagline}>Professional Video Conferencing</span>
        </div>
        <button 
          onClick={goToDashboard}
          style={styles.homeButton}
          aria-label="Go to dashboard"
          title="Dashboard"
        >
          <svg 
            style={styles.homeIcon} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Ready to Join?</h2>
            <p style={styles.subtitle}>Check your audio and video before joining</p>
          </div>

          {/* Video Preview */}
          <div style={styles.videoContainer}>
            {isLoading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading camera...</p>
              </div>
            ) : error ? (
              <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>!</div>
                <p style={styles.errorText}>{error}</p>
              </div>
            ) : (
              <>
                <div style={styles.videoWrapper}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      ...styles.video,
                      filter: cameraOn ? 'none' : 'grayscale(100%) brightness(0.5)'
                    }}
                  />
                  {!cameraOn && (
                    <div style={styles.cameraOffOverlay}>
                      <svg style={styles.cameraOffIcon} viewBox="0 0 24 24">
                        <path d="M3 3l18 18M10.584 10.587a2 2 0 002.829 2.828" />
                        <path d="M9.363 5.365A9.466 9.466 0 0112 5c4 0 7.333 2.333 9 7-.778 1.361-1.612 2.524-2.503 3.488m-2.14 1.861A15.33 15.33 0 0112 17c-4 0-7.333-2.333-9-7 1.369-2.395 3.247-4.17 5.535-5.317" />
                      </svg>
                      Camera is off
                    </div>
                  )}
                  <div style={styles.videoBadges}>
                    <div style={styles.badge}>
                      {micOn ? '🎤' : '🔇'} {micOn ? 'Mic On' : 'Mic Off'}
                    </div>
                    <div style={styles.badge}>
                      {cameraOn ? '📹' : '📷'} {cameraOn ? 'Camera On' : 'Camera Off'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div style={styles.controlsContainer}>
            <div style={styles.toggleButtons}>
              <button
                onClick={toggleMic}
                style={{
                  ...styles.toggleButton,
                  ...(micOn ? styles.buttonActive : styles.buttonInactive)
                }}
              >
                {micOn ? (
                  <svg style={styles.icon} viewBox="0 0 24 24">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                ) : (
                  <svg style={styles.icon} viewBox="0 0 24 24">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                    <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
                <span style={styles.buttonText}>
                  {micOn ? "Mute" : "Unmute"}
                </span>
              </button>

              <button
                onClick={toggleCamera}
                style={{
                  ...styles.toggleButton,
                  ...(cameraOn ? styles.buttonActive : styles.buttonInactive)
                }}
              >
                {cameraOn ? (
                  <svg style={styles.icon} viewBox="0 0 24 24">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                ) : (
                  <svg style={styles.icon} viewBox="0 0 24 24">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h4a2 2 0 012 2v9.34m-7.72-2.06a4 4 0 11-5.56-5.56" />
                  </svg>
                )}
                <span style={styles.buttonText}>
                  {cameraOn ? "Stop Video" : "Start Video"}
                </span>
              </button>
            </div>

            <button
              onClick={joinMeeting}
              style={styles.joinButton}
              disabled={isLoading}
            >
              <svg style={styles.joinIcon} viewBox="0 0 24 24">
                <path d="M15 12l-4-4v8l4-4z" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Join Meeting Now
            </button>
          </div>

          {/* Help text */}
          <div style={styles.helpText}>
            <p style={styles.tip}>
              💡 <strong>Tip:</strong> Make sure you're in a well-lit area and your background is clean
            </p>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 ZATROOM. Professional video conferencing solution.
        </p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 2rem",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    fontSize: "2rem",
    fontWeight: "800",
    background: "linear-gradient(90deg, #fff, #f0f0f0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  },
  tagline: {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: "0.25rem",
  },
  homeButton: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: "50%",
    width: "3rem",
    height: "3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  homeIcon: {
    width: "1.5rem",
    height: "1.5rem",
    color: "#fff",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    padding: "2.5rem",
    maxWidth: "600px",
    width: "100%",
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "0.5rem",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#718096",
    fontSize: "1rem",
    fontWeight: "500",
  },
  videoContainer: {
    marginBottom: "2rem",
  },
  videoWrapper: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
  video: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    display: "block",
    transition: "filter 0.3s ease",
  },
  cameraOffOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.7)",
    color: "#fff",
    fontSize: "1.125rem",
    fontWeight: "600",
  },
  cameraOffIcon: {
    width: "3rem",
    height: "3rem",
    stroke: "#fff",
    strokeWidth: "1.5",
    marginBottom: "0.5rem",
    fill: "none",
  },
  videoBadges: {
    position: "absolute",
    bottom: "1rem",
    left: "1rem",
    display: "flex",
    gap: "0.5rem",
  },
  badge: {
    background: "rgba(0, 0, 0, 0.7)",
    color: "#fff",
    padding: "0.375rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.875rem",
    fontWeight: "500",
    backdropFilter: "blur(4px)",
  },
  loadingContainer: {
    height: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7fafc",
    borderRadius: "16px",
  },
  spinner: {
    width: "3rem",
    height: "3rem",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    color: "#718096",
    fontWeight: "500",
  },
  errorContainer: {
    height: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#fed7d7",
    borderRadius: "16px",
    padding: "2rem",
  },
  errorIcon: {
    width: "4rem",
    height: "4rem",
    background: "#e53e3e",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  errorText: {
    color: "#c53030",
    textAlign: "center",
    fontWeight: "500",
  },
  controlsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  toggleButtons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  toggleButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "1rem",
    borderRadius: "12px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    maxWidth: "200px",
  },
  buttonActive: {
    background: "#48bb78",
    color: "#fff",
  },
  buttonInactive: {
    background: "#e2e8f0",
    color: "#4a5568",
  },
  buttonText: {
    fontSize: "0.9375rem",
  },
  icon: {
    width: "1.25rem",
    height: "1.25rem",
    stroke: "currentColor",
    strokeWidth: "2",
    fill: "none",
  },
  joinButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    padding: "1.25rem 2rem",
    borderRadius: "16px",
    fontSize: "1.125rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
  },
  joinIcon: {
    width: "1.5rem",
    height: "1.5rem",
    stroke: "currentColor",
    strokeWidth: "2",
    fill: "none",
  },
  helpText: {
    marginTop: "2rem",
    textAlign: "center",
  },
  tip: {
    color: "#718096",
    fontSize: "0.9375rem",
    background: "#f7fafc",
    padding: "1rem",
    borderRadius: "12px",
    borderLeft: "4px solid #48bb78",
  },
  footer: {
    padding: "1.5rem 2rem",
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.875rem",
  },
};

// Add CSS animation for spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);