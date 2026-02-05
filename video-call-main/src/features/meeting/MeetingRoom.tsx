import { useEffect, useRef, useState } from "react";
import { 
  FiMic, 
  FiVideo, 
  FiPhoneOff, 
  FiUsers,
  FiShare2,
  FiMessageSquare,
  FiSmile,
  FiMaximize,
  FiMoreVertical,
  FiMicOff,
  FiVideoOff,
  FiSettings,
  FiMonitor,
  FiCopy,
  FiDownload,
  FiMoreHorizontal,
  FiChevronUp,
  FiChevronDown,
  FiPenTool,
  FiRadio,
  FiSend
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import "./meeting.css";

export default function MeetingRoom() {
  const videoRef = useRef(null);
  const chatRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [stream, setStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [activeTool, setActiveTool] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [reactions, setReactions] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [meetingTime, setMeetingTime] = useState(0);
  
  // Mock participants data
  const [participants, setParticipants] = useState([
    { id: 1, name: "Michael Chen", isSpeaking: true, isVideoOn: true, isAudioOn: true, role: "Host" },
    { id: 2, name: "Sarah Johnson", isSpeaking: false, isVideoOn: true, isAudioOn: true, role: "Co-host" },
    { id: 3, name: "John Wilson", isSpeaking: false, isVideoOn: false, isAudioOn: true, role: "Participant" },
    { id: 4, name: "Emily Davis", isSpeaking: false, isVideoOn: true, isAudioOn: false, role: "Participant" },
    { id: 5, name: "Alex Turner", isSpeaking: false, isVideoOn: true, isAudioOn: true, role: "Participant" },
    { id: 6, name: "Maria Garcia", isSpeaking: false, isVideoOn: false, isAudioOn: true, role: "Participant" },
    { id: 7, name: "David Kim", isSpeaking: false, isVideoOn: true, isAudioOn: true, role: "Participant" },
  ]);

  const currentUser = location.state?.name || "You";
  const meetingId = location.state?.meetingCode || "123-456-789";

  useEffect(() => {
    // Initialize media stream
    initializeMedia();
    
    // Start meeting timer
    const timer = setInterval(() => {
      setMeetingTime(prev => prev + 1);
    }, 1000);
    
    // Mock network latency updates
    const latencyInterval = setInterval(() => {
      // Simulate latency changes
    }, 5000);
    
    // Auto-record after 30 seconds
    const recordTimeout = setTimeout(() => {
      setIsRecording(true);
    }, 30000);
    
    // Add some initial messages
    setMessages([
      { id: 1, sender: "Michael Chen", text: "Welcome everyone!", time: "10:00" },
      { id: 2, sender: "Sarah Johnson", text: "Thanks for joining!", time: "10:01" },
      { id: 3, sender: "System", text: "Emily Davis joined the meeting", time: "10:02" },
    ]);
    
    // Add some reactions
    setReactions([
      { id: 1, emoji: "👏", sender: "John Wilson", time: "10:03" },
      { id: 2, emoji: "👍", sender: "Alex Turner", time: "10:04" },
    ]);

    return () => {
      clearInterval(timer);
      clearInterval(latencyInterval);
      clearTimeout(recordTimeout);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: location.state?.videoEnabled !== false,
        audio: location.state?.audioEnabled !== false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setAudioEnabled(location.state?.audioEnabled !== false);
      setVideoEnabled(location.state?.videoEnabled !== false);
    } catch (error) {
      console.error("Error accessing media:", error);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
          setIsScreenSharing(true);
          
          // Handle when screen sharing stops
          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            if (stream && videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          };
        }
      } else {
        if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsScreenSharing(false);
        }
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: currentUser,
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      // Auto scroll to bottom
      if (chatRef.current) {
        setTimeout(() => {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }, 100);
      }
    }
  };

  const sendReaction = (emoji) => {
    const newReaction = {
      id: reactions.length + 1,
      emoji,
      sender: currentUser,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setReactions([...reactions, newReaction]);
    
    // Animate reaction
    const reactionEl = document.createElement('div');
    reactionEl.className = 'floating-reaction';
    reactionEl.textContent = emoji;
    reactionEl.style.position = 'absolute';
    reactionEl.style.fontSize = '24px';
    reactionEl.style.animation = 'floatUp 2s forwards';
    reactionEl.style.left = `${Math.random() * 80 + 10}%`;
    reactionEl.style.bottom = '100px';
    document.querySelector('.meeting').appendChild(reactionEl);
    
    setTimeout(() => {
      reactionEl.remove();
    }, 2000);
  };

  const selectTool = (tool) => {
    setActiveTool(activeTool === tool ? null : tool);
  };

  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (isScreenSharing) {
      const screenStream = videoRef.current?.srcObject;
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    }
    navigate("/");
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join?meeting=${meetingId}`);
    alert("Meeting link copied to clipboard!");
  };

  // Format meeting time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="meeting">
      {/* Main Video Grid */}
      <div className="video-grid">
        {participants.slice(0, 4).map((participant, index) => (
          <div key={participant.id} className={`video-tile ${participant.isSpeaking ? 'speaking' : ''}`}>
            {participant.isVideoOn ? (
              <div className="video-placeholder">
                <div className="video-label">
                  <span className="participant-name">{participant.name}</span>
                  {participant.role && <span className="participant-role">{participant.role}</span>}
                  {!participant.isAudioOn && <span className="muted-indicator">🔇</span>}
                </div>
              </div>
            ) : (
              <div className="video-off">
                <div className="avatar-large">
                  {participant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="video-label">
                  <span className="participant-name">{participant.name}</span>
                  {participant.role && <span className="participant-role">{participant.role}</span>}
                  {!participant.isAudioOn && <span className="muted-indicator">🔇</span>}
                </div>
              </div>
            )}
            {participant.isSpeaking && <div className="speaking-indicator"></div>}
          </div>
        ))}
        
        {/* Your Video */}
        <div className="video-tile self-view">
          <video 
            ref={videoRef} 
            autoPlay 
            muted
            className={!videoEnabled ? 'hidden' : ''}
          />
          {!videoEnabled && (
            <div className="video-off">
              <div className="avatar-large">YOU</div>
            </div>
          )}
          <div className="video-label">
            <span className="participant-name">{currentUser} (You)</span>
            {!audioEnabled && <span className="muted-indicator">🔇</span>}
            {!videoEnabled && <span className="muted-indicator">📷❌</span>}
          </div>
        </div>
      </div>

      {/* Top Bar - Meeting Info */}
      <div className="top-bar">
        <div className="meeting-info">
          <div className="meeting-id">
            <span>Meeting ID: {meetingId}</span>
            <button onClick={copyMeetingLink} className="copy-btn">
              <FiCopy size={14} />
            </button>
          </div>
          <div className="meeting-timer">
            <span>{formatTime(meetingTime)}</span>
          </div>
          <div className="network-status">
            <span className="status-dot"></span>
            <span>21ms</span>
          </div>
        </div>
        
        <div className="meeting-actions">
          {isRecording && (
            <div className="recording-indicator">
              <div className="recording-dot"></div>
              <span>Recording</span>
              <button onClick={toggleRecording} className="stop-record">
                Stop
              </button>
            </div>
          )}
          
          <button className="action-btn" onClick={toggleFullscreen}>
            <FiMaximize />
          </button>
          
          <button className="action-btn">
            <FiMoreVertical />
          </button>
        </div>
      </div>

      {/* Right Side Panel - Participants & Chat */}
      <div className="side-panel">
        {/* Participants Panel */}
        <div className={`panel-section ${showParticipants ? 'expanded' : ''}`}>
          <div className="panel-header" onClick={() => setShowParticipants(!showParticipants)}>
            <div className="panel-title">
              <FiUsers />
              <span>Participants ({participants.length + 1})</span>
            </div>
            <div className="panel-toggle">
              {showParticipants ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
          
          {showParticipants && (
            <div className="panel-content">
              <div className="participants-list">
                <div className="participant-item host">
                  <div className="participant-avatar">MC</div>
                  <div className="participant-details">
                    <span className="participant-name">Michael Chen</span>
                    <span className="participant-status">Host • Speaking</span>
                  </div>
                  <div className="participant-actions">
                    <FiMic className="status-icon active" />
                  </div>
                </div>
                
                <div className="participant-item you">
                  <div className="participant-avatar">YOU</div>
                  <div className="participant-details">
                    <span className="participant-name">{currentUser}</span>
                    <span className="participant-status">You • {audioEnabled ? 'Unmuted' : 'Muted'}</span>
                  </div>
                  <div className="participant-actions">
                    {audioEnabled ? <FiMic className="status-icon active" /> : <FiMicOff className="status-icon muted" />}
                  </div>
                </div>
                
                {participants.slice(1).map(participant => (
                  <div key={participant.id} className="participant-item">
                    <div className="participant-avatar">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="participant-details">
                      <span className="participant-name">{participant.name}</span>
                      <span className="participant-status">
                        {participant.role} • {participant.isAudioOn ? 'Unmuted' : 'Muted'}
                      </span>
                    </div>
                    <div className="participant-actions">
                      {participant.isAudioOn ? 
                        <FiMic className="status-icon active" /> : 
                        <FiMicOff className="status-icon muted" />
                      }
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="invite-btn">
                <FiCopy size={14} />
                <span>Invite</span>
              </button>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className={`panel-section ${showChat ? 'expanded' : ''}`}>
          <div className="panel-header" onClick={() => setShowChat(!showChat)}>
            <div className="panel-title">
              <FiMessageSquare />
              <span>Chat</span>
              {messages.length > 0 && <span className="badge">{messages.length}</span>}
            </div>
            <div className="panel-toggle">
              {showChat ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
          
          {showChat && (
            <>
              <div className="chat-messages" ref={chatRef}>
                {messages.map(msg => (
                  <div key={msg.id} className={`message ${msg.sender === currentUser ? 'sent' : 'received'}`}>
                    <div className="message-sender">{msg.sender}</div>
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">{msg.time}</div>
                  </div>
                ))}
              </div>
              
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="emoji-btn" onClick={() => sendReaction('👍')}>
                  <FiSmile />
                </button>
                <button className="send-btn" onClick={sendMessage}>
                  <FiSend />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="reactions-preview">
            {reactions.slice(-3).map(r => (
              <div key={r.id} className="reaction-bubble">
                <span>{r.emoji}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="control-bar">
        <div className="control-left">
          <button className={`control-btn ${audioEnabled ? '' : 'muted'}`} onClick={toggleAudio}>
            {audioEnabled ? <FiMic /> : <FiMicOff />}
            <span>{audioEnabled ? 'Mute' : 'Unmute'}</span>
          </button>
          
          <button className={`control-btn ${videoEnabled ? '' : 'off'}`} onClick={toggleVideo}>
            {videoEnabled ? <FiVideo /> : <FiVideoOff />}
            <span>{videoEnabled ? 'Stop Video' : 'Start Video'}</span>
          </button>
          
          <button className="control-btn">
            <FiSettings />
            <span>Settings</span>
          </button>
        </div>
        
        <div className="control-center">
          <button 
            className={`control-btn ${isScreenSharing ? 'active' : ''}`} 
            onClick={toggleScreenShare}
          >
            <FiShare2 />
            <span>{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
          </button>
          
          <button 
            className={`control-btn ${activeTool === 'pen' ? 'active' : ''}`}
            onClick={() => selectTool('pen')}
          >
            <FiPenTool />
            <span>Whiteboard</span>
          </button>
          
          <button 
            className={`control-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
          >
            <div className={`record-icon ${isRecording ? 'pulsing' : ''}`}></div>
            <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
          </button>
          
          <button className="control-btn" onClick={() => setShowChat(true)}>
            <FiMessageSquare />
            <span>Chat</span>
          </button>
          
          <button className="control-btn" onClick={() => sendReaction('👏')}>
            <FiSmile />
            <span>Reactions</span>
          </button>
        </div>
        
        <div className="control-right">
          <button className="control-btn leave" onClick={handleEndCall}>
            <FiPhoneOff />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Floating Reactions */}
      <div className="reactions-bar">
        <div className="reactions-quick">
          <button onClick={() => sendReaction('👍')}>👍</button>
          <button onClick={() => sendReaction('👏')}>👏</button>
          <button onClick={() => sendReaction('🎉')}>🎉</button>
          <button onClick={() => sendReaction('🔥')}>🔥</button>
          <button onClick={() => sendReaction('❤️')}>❤️</button>
        </div>
      </div>
    </div>
  );
}