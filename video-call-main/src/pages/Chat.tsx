import { useEffect, useState, useRef } from "react";
import { socket } from "../api/socket";
import "./Chat.css";
import EmojiPicker from "./EmojiPicker";



function getRoomId(user1: string, user2: string) {
  return [user1.trim().toLowerCase(), user2.trim().toLowerCase()].sort().join("_");
}

interface MediaItem {
  file_url: string;
  thumbnail_url?: string;
  file_name: string;
  file_type: string;
  file_category: string;
  created_at: string;
  username: string;
}

interface FileInfo {
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  created_at: string;
  username: string;
  file_category: string;
  file_width?: number;
  file_height?: number;
}

export default function Chat() {
  const username = localStorage.getItem("username");
  const [partner, setPartner] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState("");
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("chatTheme") || "cosmic");
  const [bgColor, setBgColor] = useState(localStorage.getItem("chatBgColor") || "#0f172a");
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [mediaGallery, setMediaGallery] = useState<MediaItem[]>([]);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [deleteForEveryone, setDeleteForEveryone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const filePreviewRef = useRef<HTMLDivElement>(null);

  // Auto-scroll and Mark as Read
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });

    const unreadIds = messages
      .filter((m) => m.username !== username && !m.is_read)
      .map((m) => m.id);

    if (unreadIds.length > 0 && roomId) {
      socket.emit("mark_read", { messageIds: unreadIds, roomId });
    }
  }, [messages, roomId, username]);

  // Socket event listeners
  useEffect(() => {
    if (!username) { window.location.href = "/"; return; }

    socket.on("chat_history", (history) => setMessages(history));
    
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("file_received", (fileMsg) => {
      setMessages((prev) => [...prev, fileMsg]);
      // Update gallery
      socket.emit("get_media_gallery", { roomId });
    });

    socket.on("messages_read", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((m) => (messageIds.includes(m.id) ? { ...m, is_read: true } : m))
      );
    });

    socket.on("user_status", ({ username: u, status }) => {
      if (u !== username) setIsPartnerOnline(status === "online");
    });

    socket.on("typing", ({ username: u, status }) => {
      setTyping(status ? `${u} is typing...` : "");
    });

    socket.on("message_deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      socket.emit("get_media_gallery", { roomId });
    });

    socket.on("reply_sent", (replyData) => {
      setMessages((prev) => [...prev, replyData]);
    });

    socket.on("media_gallery_data", (gallery) => {
      setMediaGallery(gallery);
    });

    socket.on("file_info_data", (info) => {
      setFileInfo(info);
    });

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
      socket.off("file_received");
      socket.off("messages_read");
      socket.off("user_status");
      socket.off("typing");
      socket.off("message_deleted");
      socket.off("reply_sent");
      socket.off("media_gallery_data");
      socket.off("file_info_data");
    };
  }, [username]);

  const joinRoom = () => {
    if (!partner.trim()) return;
    const rid = getRoomId(username!, partner);
    socket.emit("join_room", { username, roomId: rid });
    setRoomId(rid);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    
    if (replyingTo) {
      socket.emit("send_reply", {
        text: text,
        roomId: roomId,
        replyToId: replyingTo.id,
        replyToUsername: replyingTo.username,
        replyToText: replyingTo.message_text
      });
      setReplyingTo(null);
    } else {
      const isEmojiOnly = text.length <= 5 && /[\p{Emoji}]/u.test(text);
      socket.emit("send_message", { text, isEmoji: isEmojiOnly });
    }
    
    socket.emit("typing", false);
    setText("");
  };

  const handleEmojiSelect = (emoji: string) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 20 * 1024 * 1024) {
      alert("File size must be less than 20MB");
      return;
    }
    
    setSelectedFile(file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendFile = () => {
    if (!selectedFile || !roomId) return;

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    
    reader.onloadstart = () => {
      setUploadProgress(10);
    };

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.onload = (e) => {
      const fileData = (e.target?.result as string).split(',')[1];
      
      socket.emit("send_file", {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileData: fileData,
        roomId: roomId,
        replyToId: replyingTo?.id,
        replyToUsername: replyingTo?.username,
        replyToText: replyingTo?.message_text
      });

      setIsUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
      setFilePreview(null);
      if (replyingTo) setReplyingTo(null);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      alert("Error reading file. Please try again.");
    };

    reader.readAsDataURL(selectedFile);
  };

  const cancelFileUpload = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📽️';
    if (fileType.startsWith('video/')) return '🎬';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('zip') || fileType.includes('compressed')) return '📦';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openMediaGallery = () => {
    socket.emit("get_media_gallery", { roomId });
    setShowMediaGallery(true);
  };

  const openFilePreview = (media: MediaItem) => {
    setSelectedMedia(media);
    setShowFilePreview(true);
    socket.emit("get_file_info", { messageId: media.message_id });
  };

  const closeFilePreview = () => {
    setShowFilePreview(false);
    setSelectedMedia(null);
    setFileInfo(null);
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteMessage = (messageId: string) => {
    socket.emit("delete_message", { messageId, roomId, deleteForEveryone });
    setShowDeleteConfirm(null);
  };

  const handleReply = (message: any) => {
    setReplyingTo(message);
    const input = document.querySelector('.message-input') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("chatTheme", newTheme);
    
    const themes: Record<string, string> = {
      cosmic: "#0f172a",
      midnight: "#1a1b2e",
      aurora: "#1e293b",
      nebula: "#1e1b4b",
      forest: "#1c2c2c",
      sunset: "#2c1b1e"
    };
    setBgColor(themes[newTheme]);
    localStorage.setItem("chatBgColor", themes[newTheme]);
  };

  const handleBgColorChange = (color: string) => {
    setBgColor(color);
    localStorage.setItem("chatBgColor", color);
  };

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  // Filter media by category
  const images = mediaGallery.filter(m => m.file_category === 'image');
  const videos = mediaGallery.filter(m => m.file_category === 'video');
  const documents = mediaGallery.filter(m => ['pdf', 'document', 'spreadsheet', 'presentation'].includes(m.file_category));
  const audio = mediaGallery.filter(m => m.file_category === 'audio');
  const other = mediaGallery.filter(m => !['image', 'video', 'audio', 'pdf', 'document', 'spreadsheet', 'presentation'].includes(m.file_category));

  return (
    <div className="chat-container">
      <button className="home-button" onClick={goToDashboard}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </button>

      {!roomId ? (
        <div className="setup-box">
          <div className="setup-header">
            <div className="setup-logo">⚡</div>
            <h3 className="setup-title">Connect & Chat</h3>
            <p className="setup-subtitle">Enter username to start conversation</p>
          </div>
          
          <div className="partner-input-container">
            <div className="input-icon-wrapper">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input 
                className="partner-input" 
                placeholder="@username" 
                value={partner} 
                onChange={(e) => setPartner(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              />
            </div>
            <button className="connect-button" onClick={joinRoom}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"></path>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
              Connect
            </button>
          </div>

          <div className="user-card">
            <div className="user-avatar-large">
              {username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name-display">{username}</div>
              <div className="user-status-indicator">
                <span className="status-dot online"></span>
                Ready to connect
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-wrapper" style={{ backgroundColor: bgColor }}>
          {/* Settings Panel */}
          {showSettings && (
            <div className="settings-panel">
              <div className="settings-header">
                <h3>Chat Settings</h3>
                <button className="close-settings" onClick={() => setShowSettings(false)}>×</button>
              </div>
              
              <div className="theme-selection">
                <h4>Theme</h4>
                <div className="theme-grid">
                  {["cosmic", "midnight", "aurora", "nebula", "forest", "sunset"].map((t) => (
                    <button
                      key={t}
                      className={`theme-option ${theme === t ? 'active' : ''}`}
                      onClick={() => handleThemeChange(t)}
                    >
                      <div className={`theme-preview theme-${t}`}></div>
                      <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="custom-color">
                <h4>Custom Color</h4>
                <div className="color-picker">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                  />
                  <span>{bgColor}</span>
                </div>
              </div>
            </div>
          )}

          {/* Info Panel */}
          {showInfoPanel && (
            <div className="info-panel">
              <div className="info-panel-header">
                <h3>Chat Info</h3>
                <button className="close-info" onClick={() => setShowInfoPanel(false)}>×</button>
              </div>
              
              <div className="info-user-card">
                <div className="info-avatar">
                  {partner?.charAt(0).toUpperCase()}
                </div>
                <div className="info-user-details">
                  <h4>{partner}</h4>
                  <p className={`info-status ${isPartnerOnline ? 'online' : 'offline'}`}>
                    {isPartnerOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="info-stats">
                <div className="stat-item">
                  <span className="stat-label">Messages</span>
                  <span className="stat-value">{messages.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Media</span>
                  <span className="stat-value">{mediaGallery.length}</span>
                </div>
              </div>

              <div className="info-actions">
                <button className="info-action-btn" onClick={openMediaGallery}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Media Gallery
                </button>
                
                <button className="info-action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  Links
                </button>
              </div>
            </div>
          )}

          {/* Media Gallery Modal */}
          {showMediaGallery && (
            <div className="gallery-modal-overlay">
              <div className="gallery-modal">
                <div className="gallery-header">
                  <h3>Media, Links and Docs</h3>
                  <button className="close-gallery" onClick={() => setShowMediaGallery(false)}>×</button>
                </div>
                
                <div className="gallery-tabs">
                  <button className="gallery-tab active">All</button>
                  <button className="gallery-tab">Photos</button>
                  <button className="gallery-tab">Videos</button>
                  <button className="gallery-tab">Docs</button>
                </div>

                <div className="gallery-content">
                  {/* Images Grid */}
                  {images.length > 0 && (
                    <div className="gallery-section">
                      <h4>Photos ({images.length})</h4>
                      <div className="image-grid">
                        {images.map((img, idx) => (
                          <div 
                            key={idx} 
                            className="gallery-item"
                            onClick={() => openFilePreview(img)}
                          >
                            <img 
                              src={img.thumbnail_url || img.file_url} 
                              alt={img.file_name}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos Grid */}
                  {videos.length > 0 && (
                    <div className="gallery-section">
                      <h4>Videos ({videos.length})</h4>
                      <div className="video-grid">
                        {videos.map((vid, idx) => (
                          <div 
                            key={idx} 
                            className="gallery-item video-item"
                            onClick={() => openFilePreview(vid)}
                          >
                            <div className="video-thumbnail">
                              <span className="video-icon">▶️</span>
                            </div>
                            <span className="file-name">{vid.file_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents List */}
                  {documents.length > 0 && (
                    <div className="gallery-section">
                      <h4>Documents ({documents.length})</h4>
                      <div className="documents-list">
                        {documents.map((doc, idx) => (
                          <div 
                            key={idx} 
                            className="document-item"
                            onClick={() => openFilePreview(doc)}
                          >
                            <span className="doc-icon">{getFileIcon(doc.file_type)}</span>
                            <div className="doc-info">
                              <span className="doc-name">{doc.file_name}</span>
                              <span className="doc-size">{formatFileSize(doc.file_size)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* File Preview Modal */}
          {showFilePreview && selectedMedia && (
            <div className="file-preview-modal-overlay" onClick={closeFilePreview}>
              <div className="file-preview-modal" onClick={(e) => e.stopPropagation()}>
                <div className="file-preview-header">
                  <button className="back-button" onClick={closeFilePreview}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                  </button>
                  
                  <div className="file-preview-info">
                    <span className="file-name">{selectedMedia.file_name}</span>
                    <span className="file-date">{formatDate(selectedMedia.created_at)}</span>
                  </div>

                  <button 
                    className="download-preview-btn"
                    onClick={() => downloadFile(selectedMedia.file_url, selectedMedia.file_name)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                </div>

                <div className="file-preview-content">
                  {selectedMedia.file_category === 'image' ? (
                    <img 
                      src={selectedMedia.file_url} 
                      alt={selectedMedia.file_name}
                      className="full-size-image"
                    />
                  ) : selectedMedia.file_category === 'video' ? (
                    <video 
                      controls 
                      className="full-size-video"
                    >
                      <source src={selectedMedia.file_url} type={selectedMedia.file_type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedMedia.file_category === 'audio' ? (
                    <div className="audio-player">
                      <audio controls style={{ width: '100%' }}>
                        <source src={selectedMedia.file_url} type={selectedMedia.file_type} />
                      </audio>
                    </div>
                  ) : (
                    <div className="document-preview">
                      <div className="doc-preview-icon">
                        <span className="doc-icon-large">{getFileIcon(selectedMedia.file_type)}</span>
                      </div>
                      <div className="doc-preview-info">
                        <h4>{selectedMedia.file_name}</h4>
                        <p>{formatFileSize(selectedMedia.file_size)}</p>
                        <button 
                          className="open-doc-btn"
                          onClick={() => window.open(selectedMedia.file_url, '_blank')}
                        >
                          Open Document
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {fileInfo && (
                  <div className="file-info-panel">
                    <h4>File Information</h4>
                    <div className="file-info-grid">
                      <div className="info-item">
                        <span className="info-label">Type:</span>
                        <span className="info-value">{fileInfo.file_type}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Size:</span>
                        <span className="info-value">{formatFileSize(fileInfo.file_size)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Sent by:</span>
                        <span className="info-value">{fileInfo.username}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Date:</span>
                        <span className="info-value">{formatDate(fileInfo.created_at)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="chat-header">
            <div className="header-left">
              <button className="back-button" onClick={() => setRoomId("")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              
              <div 
                className="header-user"
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                style={{ cursor: 'pointer' }}
              >
                <div className={`partner-avatar ${isPartnerOnline ? 'online' : 'offline'}`}>
                  {partner?.charAt(0).toUpperCase()}
                </div>
                <div className="header-user-info">
                  <div className="partner-name">{partner}</div>
                  <div className={`partner-status ${isPartnerOnline ? 'online' : 'offline'}`}>
                    {isPartnerOnline ? "● Active now" : "Last seen recently"}
                  </div>
                </div>
              </div>
            </div>

            <div className="header-right">
              <button 
                className="info-button"
                onClick={openMediaGallery}
                title="Media Gallery"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </button>
              
              <button className="settings-button" onClick={() => setShowSettings(!showSettings)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="message-list">
            <div className="chat-date">
              <span>Today</span>
              <div className="date-line"></div>
            </div>
            
            {messages.map((m, i) => {
              const isMe = m.username === username;
              const showAvatar = i === 0 || messages[i-1]?.username !== m.username;
              const isConsecutive = i > 0 && messages[i-1]?.username === m.username;
              const canDelete = isMe;
              const isFileMessage = !!m.file_url;
              const isEmojiMessage = m.is_emoji;
              
              return (
                <div 
                  key={i} 
                  className={`message-row ${isMe ? 'message-row-me' : 'message-row-other'}`}
                  onMouseEnter={() => setHoveredMessageId(m.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  {!isMe && showAvatar && (
                    <div className="avatar-small">
                      {m.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className={`message-bubble ${isMe ? 'message-bubble-me' : 'message-bubble-other'} ${isConsecutive ? 'consecutive' : ''} ${isFileMessage ? 'file-message' : ''} ${isEmojiMessage ? 'emoji-message' : ''}`}>
                    {/* Reply Preview */}
                    {m.replyToId && (
                      <div className="reply-preview">
                        <div className="reply-sender">{m.replyToUsername}</div>
                        <div className="reply-text">
                          {m.replyToText && m.replyToText.length > 50 
                            ? m.replyToText.substring(0, 50) + '...'
                            : m.replyToText}
                        </div>
                      </div>
                    )}
                    
                    {/* File Display */}
                    {isFileMessage ? (
                      <div className="file-message-content">
                        {m.file_category === 'image' ? (
                          <div 
                            className="image-message"
                            onClick={() => openFilePreview({
                              ...m,
                              message_id: m.id
                            })}
                          >
                            <img 
                              src={m.thumbnail_url || m.file_url} 
                              alt={m.message_text}
                              className="chat-image"
                            />
                            <div className="image-overlay">
                              <span className="file-name">{m.message_text}</span>
                              <span className="file-size">{formatFileSize(m.file_size)}</span>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="file-attachment"
                            onClick={() => openFilePreview({
                              ...m,
                              message_id: m.id
                            })}
                          >
                            <div className="file-icon-container">
                              <span className="file-icon-large">{getFileIcon(m.file_type)}</span>
                            </div>
                            <div className="file-details">
                              <span className="file-name">{m.message_text}</span>
                              <div className="file-meta">
                                <span className="file-type">{m.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                                <span className="file-size">{formatFileSize(m.file_size)}</span>
                              </div>
                            </div>
                            <button 
                              className="download-file-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(m.file_url, m.message_text);
                              }}
                              title="Download"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Regular Message Content */
                      <div className={`message-text ${isEmojiMessage ? 'emoji-text' : ''}`}>
                        {m.message_text}
                      </div>
                    )}
                    
                    {/* Hover Actions */}
                    {hoveredMessageId === m.id && (
                      <div className={`message-actions ${isMe ? 'actions-me' : 'actions-other'}`}>
                        {canDelete && (
                          <button 
                            className="message-action delete-action"
                            onClick={() => setShowDeleteConfirm(m.id)}
                            title="Delete message"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        )}
                        
                        <button 
                          className="message-action reply-action"
                          onClick={() => handleReply(m)}
                          title="Reply to message"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 17 4 12 9 7"></polyline>
                            <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                          </svg>
                        </button>
                        
                        {!isFileMessage && !isEmojiMessage && (
                          <button 
                            className="message-action copy-action"
                            onClick={() => {
                              navigator.clipboard.writeText(m.message_text);
                              const toast = document.createElement('div');
                              toast.className = 'copy-toast';
                              toast.textContent = 'Copied to clipboard!';
                              document.body.appendChild(toast);
                              setTimeout(() => toast.remove(), 2000);
                            }}
                            title="Copy message"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                        )}
                        
                        {isFileMessage && (
                          <button 
                            className="message-action download-action"
                            onClick={() => downloadFile(m.file_url, m.message_text)}
                            title="Download file"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                          </button>
                        )}
                      </div>
                    )}

                    <div className="message-meta">
                      <span className="message-time">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        <span className={`read-status ${m.is_read ? 'read' : 'unread'}`}>
                          {m.is_read ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {showDeleteConfirm === m.id && (
                    <div className="delete-confirmation-overlay">
                      <div className="delete-confirmation-modal">
                        <h4>Delete Message?</h4>
                        <div className="delete-options">
                          <label className="delete-option">
                            <input 
                              type="radio" 
                              name="deleteOption" 
                              checked={!deleteForEveryone}
                              onChange={() => setDeleteForEveryone(false)}
                            />
                            <span>Delete for me</span>
                          </label>
                          <label className="delete-option">
                            <input 
                              type="radio" 
                              name="deleteOption" 
                              checked={deleteForEveryone}
                              onChange={() => setDeleteForEveryone(true)}
                            />
                            <span>Delete for everyone</span>
                          </label>
                        </div>
                        <p>This action cannot be undone.</p>
                        <div className="delete-modal-actions">
                          <button 
                            className="cancel-delete"
                            onClick={() => {
                              setShowDeleteConfirm(null);
                              setDeleteForEveryone(false);
                            }}
                          >
                            Cancel
                          </button>
                          <button 
                            className="confirm-delete"
                            onClick={() => deleteMessage(m.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {typing && (
            <div className="typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">{partner} is typing...</span>
            </div>
          )}

          <div className="chat-footer">
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}

            {/* File Upload Preview */}
            {selectedFile && (
              <div className="file-upload-preview">
                <div className="file-preview-header">
                  <span>Sending {selectedFile.name}</span>
                  <button className="cancel-file-upload" onClick={cancelFileUpload}>
                    ×
                  </button>
                </div>
                <div className="file-preview-content">
                  {filePreview ? (
                    <img src={filePreview} alt="Preview" className="file-preview-image" />
                  ) : (
                    <div className="file-icon-preview">
                      <span className="file-icon-large">{getFileIcon(selectedFile.type)}</span>
                      <div className="file-info">
                        <span className="file-name">{selectedFile.name}</span>
                        <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                      </div>
                    </div>
                  )}
                  {isUploading && (
                    <div className="upload-progress">
                      <div 
                        className="upload-progress-bar" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                      <span className="upload-progress-text">{uploadProgress}%</span>
                    </div>
                  )}
                  <button 
                    className="send-file-button" 
                    onClick={sendFile}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Send File'}
                  </button>
                </div>
              </div>
            )}

            {/* Reply Preview in Input */}
            {replyingTo && !selectedFile && (
              <div className="reply-preview-input">
                <div className="reply-preview-header">
                  <span>Replying to {replyingTo.username}</span>
                  <button className="cancel-reply" onClick={cancelReply}>×</button>
                </div>
                <div className="reply-preview-content">
                  {replyingTo.file_url ? (
                    <div className="file-reply-preview">
                      <span className="file-icon-small">{getFileIcon(replyingTo.file_type)}</span>
                      <span className="file-name-preview">{replyingTo.message_text}</span>
                    </div>
                  ) : (
                    replyingTo.message_text
                  )}
                </div>
              </div>
            )}

            <div className="message-input-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
              />
              
              <button 
                className="attach-button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>
              
              <button 
                ref={emojiButtonRef}
                className="emoji-button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Emoji"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </button>
              
              <div className="input-wrapper">
                <input
                  className="message-input"
                  value={text}
                  placeholder={replyingTo ? `Reply to ${replyingTo.username}...` : "Type your message..."}
                  onChange={(e) => {
                    setText(e.target.value);
                    socket.emit("typing", true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (text.trim()) sendMessage();
                    }
                  }}
                  onBlur={() => socket.emit("typing", false)}
                />
                <div className="input-border"></div>
              </div>
              
              {text.trim() ? (
                <button className="send-button" onClick={sendMessage}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              ) : (
                <button className="voice-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}