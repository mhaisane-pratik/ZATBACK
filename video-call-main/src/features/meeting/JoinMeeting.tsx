import { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent,
  Avatar,
  Chip,
  Stack,
  IconButton
} from "@mui/material";
import { 
  FiMic, 
  FiVideo, 
  FiMicOff, 
  FiVideoOff,
  FiSettings,
  FiHeadphones,
  FiLink,
  FiUser
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function JoinMeeting() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [name, setName] = useState("");
  const [meetingCode, setMeetingCode] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);

  useEffect(() => {
    // Request permission on component mount
    requestPermission();
    getDevices();
  }, []);

  const requestPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setPermissionGranted(true);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.log("Permission not granted or camera not available");
      setPermissionGranted(false);
    }
  };

  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      setAudioDevices(audioInputs);
      setVideoDevices(videoInputs);
    } catch (error) {
      console.error("Error getting devices:", error);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
        setVideoEnabled(!videoEnabled);
      }
    }
  };

  const handleJoinMeeting = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    
    // Navigate to meeting room with state
    navigate("/meeting", { 
      state: { 
        name, 
        meetingCode, 
        audioEnabled, 
        videoEnabled,
        stream: permissionGranted ? stream : null
      } 
    });
  };

  const handleJoinWithoutVideo = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    navigate("/meeting", { 
      state: { 
        name, 
        meetingCode, 
        audioEnabled: true,
        videoEnabled: false,
        stream: null
      } 
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Card sx={{ 
        width: "100%", 
        maxWidth: 1200,
        backgroundColor: "#1e293b",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", lg: "row" },
            minHeight: 600
          }}>
            {/* Left Side - Meeting Info & Controls */}
            <Box sx={{ 
              flex: 1, 
              padding: 4,
              backgroundColor: "#1e293b",
              display: "flex",
              flexDirection: "column"
            }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 1 }}>
                  Join Meeting
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  Enter meeting details and configure your audio/video
                </Typography>
              </Box>

              {/* Meeting Inputs */}
              <Stack spacing={3} sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputLabelProps={{ style: { color: '#94a3b8' } }}
                  InputProps={{
                    style: { 
                      color: 'white',
                      backgroundColor: '#0f172a',
                      borderRadius: 2
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Meeting ID / Personal Link Name"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  InputLabelProps={{ style: { color: '#94a3b8' } }}
                  InputProps={{
                    style: { 
                      color: 'white',
                      backgroundColor: '#0f172a',
                      borderRadius: 2
                    }
                  }}
                  helperText="Leave empty to start new meeting"
                  FormHelperTextProps={{ style: { color: '#64748b' } }}
                />

                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1,
                  color: "#94a3b8",
                  fontSize: "14px"
                }}>
                  <FiLink size={16} />
                  <Typography variant="body2">
                    Or share your personal meeting link
                  </Typography>
                </Box>
              </Stack>

              {/* Audio/Video Controls */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ color: "white", mb: 2 }}>
                  Audio & Video
                </Typography>
                
                <Box sx={{ 
                  display: "flex", 
                  gap: 2, 
                  mb: 3,
                  flexWrap: "wrap"
                }}>
                  <Button
                    variant={audioEnabled ? "contained" : "outlined"}
                    onClick={toggleAudio}
                    startIcon={audioEnabled ? <FiMic /> : <FiMicOff />}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: audioEnabled ? "#3b82f6" : "transparent",
                      color: audioEnabled ? "white" : audioDevices.length > 0 ? "#3b82f6" : "#64748b",
                      borderColor: audioEnabled ? "#3b82f6" : audioDevices.length > 0 ? "#3b82f6" : "#64748b",
                      "&:hover": {
                        backgroundColor: audioEnabled ? "#2563eb" : "rgba(59, 130, 246, 0.1)"
                      }
                    }}
                  >
                    {audioEnabled ? "Mute" : "Unmute"}
                  </Button>
                  
                  <Button
                    variant={videoEnabled ? "contained" : "outlined"}
                    onClick={toggleVideo}
                    startIcon={videoEnabled ? <FiVideo /> : <FiVideoOff />}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: videoEnabled ? "#3b82f6" : "transparent",
                      color: videoEnabled ? "white" : videoDevices.length > 0 ? "#3b82f6" : "#64748b",
                      borderColor: videoEnabled ? "#3b82f6" : videoDevices.length > 0 ? "#3b82f6" : "#64748b",
                      "&:hover": {
                        backgroundColor: videoEnabled ? "#2563eb" : "rgba(59, 130, 246, 0.1)"
                      }
                    }}
                  >
                    {videoEnabled ? "Stop Video" : "Start Video"}
                  </Button>
                  
                  <IconButton
                    sx={{
                      border: "1px solid #475569",
                      color: "#94a3b8",
                      borderRadius: 2
                    }}
                  >
                    <FiSettings />
                  </IconButton>
                </Box>

                {/* Device Status */}
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FiHeadphones size={16} color="#94a3b8" />
                    <Typography variant="body2" color="#cbd5e1">
                      {audioDevices.length > 0 
                        ? audioDevices[0].label || "Default Speaker"
                        : "No audio device detected"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FiVideo size={16} color="#94a3b8" />
                    <Typography variant="body2" color="#cbd5e1">
                      {videoDevices.length > 0 
                        ? videoDevices[0].label || "Default Camera"
                        : "No camera detected"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Join Buttons */}
              <Box sx={{ mt: "auto", pt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleJoinMeeting}
                  disabled={!name.trim()}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    backgroundColor: "#3b82f6",
                    fontSize: "16px",
                    fontWeight: 600,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#2563eb"
                    },
                    "&:disabled": {
                      backgroundColor: "#475569"
                    }
                  }}
                >
                  Join Meeting
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleJoinWithoutVideo}
                  disabled={!name.trim()}
                  sx={{
                    py: 1.5,
                    color: "#94a3b8",
                    borderColor: "#475569",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#64748b",
                      backgroundColor: "rgba(71, 85, 105, 0.1)"
                    }
                  }}
                >
                  Join without Video
                </Button>
              </Box>
            </Box>

            {/* Right Side - Preview & Instructions */}
            <Box sx={{ 
              flex: 1, 
              backgroundColor: "#0f172a",
              padding: 4,
              position: "relative",
              borderLeft: { lg: "1px solid #334155" }
            }}>
              {/* Preview Header */}
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3
              }}>
                <Typography variant="h6" sx={{ color: "white" }}>
                  Preview
                </Typography>
                <Chip 
                  label={permissionGranted ? "Connected" : "Permission Required"} 
                  size="small"
                  sx={{
                    backgroundColor: permissionGranted ? "#10b981" : "#f59e0b",
                    color: "white"
                  }}
                />
              </Box>

              {/* Video Preview */}
              <Box sx={{
                position: "relative",
                backgroundColor: "#1e293b",
                borderRadius: 2,
                overflow: "hidden",
                height: 280,
                mb: 3,
                border: permissionGranted ? "2px solid #3b82f6" : "2px dashed #475569"
              }}>
                {permissionGranted ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#94a3b8"
                  }}>
                    <FiUser size={48} />
                    <Typography sx={{ mt: 2 }}>
                      Camera access required for preview
                    </Typography>
                  </Box>
                )}
                
                {/* Preview Controls */}
                <Box sx={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 1,
                  backgroundColor: "rgba(2, 6, 23, 0.8)",
                  padding: "6px 12px",
                  borderRadius: 20,
                  backdropFilter: "blur(10px)"
                }}>
                  <IconButton
                    size="small"
                    onClick={toggleAudio}
                    sx={{
                      color: audioEnabled ? "white" : "#ef4444",
                      backgroundColor: audioEnabled ? "rgba(59, 130, 246, 0.2)" : "rgba(239, 68, 68, 0.2)"
                    }}
                  >
                    {audioEnabled ? <FiMic size={16} /> : <FiMicOff size={16} />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={toggleVideo}
                    sx={{
                      color: videoEnabled ? "white" : "#ef4444",
                      backgroundColor: videoEnabled ? "rgba(59, 130, 246, 0.2)" : "rgba(239, 68, 68, 0.2)"
                    }}
                  >
                    {videoEnabled ? <FiVideo size={16} /> : <FiVideoOff size={16} />}
                  </IconButton>
                </Box>
              </Box>

              {/* Features List */}
              <Box>
                <Typography variant="subtitle1" sx={{ color: "white", mb: 2 }}>
                  Meeting Features
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: "#3b82f6",
                      fontSize: 14
                    }}>
                      <FiVideo />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="white">Screen Sharing</Typography>
                      <Typography variant="caption" color="#94a3b8">
                        Share your screen, window, or browser tab
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: "#10b981",
                      fontSize: 14
                    }}>
                      💬
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="white">Chat & Reactions</Typography>
                      <Typography variant="caption" color="#94a3b8">
                        Send messages, emojis, and reactions
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: "#8b5cf6",
                      fontSize: 14
                    }}>
                      ✏️
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="white">Whiteboard & Annotation</Typography>
                      <Typography variant="caption" color="#94a3b8">
                        Draw, write, and collaborate in real-time
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: "#f59e0b",
                      fontSize: 14
                    }}>
                      ⏺️
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="white">Recording</Typography>
                      <Typography variant="caption" color="#94a3b8">
                        Record meetings locally or to cloud
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Network Status */}
              <Box sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "4px 8px",
                backgroundColor: "rgba(2, 6, 23, 0.8)",
                borderRadius: 12,
                color: "#10b981"
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  animation: "pulse 2s infinite"
                }}></div>
                <Typography variant="caption">
                  Network: Excellent (21ms)
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <style jsx="true">{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
}