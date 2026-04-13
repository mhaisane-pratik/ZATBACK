import { Server, Socket } from "socket.io";
import { pool } from "./db";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import sharp from "sharp";
import { fromBuffer } from 'file-type';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

// Track online users
const onlineUsers = new Map<string, string>();

// Configure upload directory
const UPLOAD_DIR = path.join(__dirname, "../uploads");
const THUMBNAIL_DIR = path.join(__dirname, "../uploads/thumbnails");

const ensureUploadDirs = async () => {
  if (!fs.existsSync(UPLOAD_DIR)) await mkdirAsync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(THUMBNAIL_DIR)) await mkdirAsync(THUMBNAIL_DIR, { recursive: true });
};

ensureUploadDirs();

const generateUniqueId = () => uuidv4();

const getFileExtension = (filename: string) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

const getFileCategory = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'spreadsheet';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive';
  return 'file';
};

const createThumbnail = async (buffer: Buffer, filename: string): Promise<{thumbnailName: string | null, width?: number, height?: number}> => {
  try {
    const ext = getFileExtension(filename).toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    
    if (imageExts.includes(ext)) {
      const thumbnailName = `thumb_${uuidv4()}.jpg`;
      const thumbnailPath = path.join(THUMBNAIL_DIR, thumbnailName);
      
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      await image
        .resize(200, 200, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);
      
      return {
        thumbnailName,
        width: metadata.width,
        height: metadata.height
      };
    }
    return { thumbnailName: null };
  } catch (error) {
    console.error("Thumbnail creation error:", error);
    return { thumbnailName: null };
  }
};

export const initSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    
    // JOIN ROOM
    socket.on("join_room", async ({ username, roomId }) => {
      try {
        if (!username || !roomId) return;

        socket.data.username = username;
        socket.data.roomId = roomId;
        onlineUsers.set(username, socket.id);

        socket.join(roomId);

        // Notify others in room that user is online
        io.to(roomId).emit("user_status", { username, status: "online" });

        // LOAD HISTORY with all data
        const history = await pool.query(
          `SELECT id, username, message_text, created_at, is_read, is_emoji,
                  reply_to_id, reply_to_username, reply_to_text,
                  file_name, file_type, file_size, file_url, thumbnail_url,
                  file_category, file_width, file_height
           FROM chat_app 
           WHERE row_type = 'message' AND room_id = $1 
           ORDER BY created_at ASC`,
          [roomId]
        );

        socket.emit("chat_history", history.rows);
      } catch (error) {
        console.error("join_room error:", error);
      }
    });

    // SEND MESSAGE (with emoji support)
    socket.on("send_message", async (data: { text: string; isEmoji?: boolean }) => {
      try {
        const { username, roomId } = socket.data;
        const { text, isEmoji = false } = data;
        
        if (!username || !roomId || !text) return;

        const result = await pool.query(
          `INSERT INTO chat_app (row_type, username, room_id, message_text, is_read, is_emoji)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, username, message_text, created_at, is_read, is_emoji`,
          ["message", username, roomId, text, false, isEmoji]
        );

        io.to(roomId).emit("receive_message", result.rows[0]);
      } catch (error) {
        console.error("send_message error:", error);
      }
    });

    // SEND FILE
    socket.on("send_file", async (fileData: {
      fileName: string;
      fileType: string;
      fileSize: number;
      fileData: string;
      roomId: string;
      replyToId?: string;
      replyToUsername?: string;
      replyToText?: string;
    }) => {
      try {
        const { username } = socket.data;
        const { fileName, fileType, fileSize, fileData: base64Data, roomId, replyToId, replyToUsername, replyToText } = fileData;
        
        if (!username || !roomId) return;

        // Generate unique filename
        const fileId = uuidv4();
        const fileExtension = getFileExtension(fileName);
        const uniqueFileName = `${fileId}.${fileExtension}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFileName);
        
        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, 'base64');
        await writeFileAsync(filePath, buffer);

        // Get file category
        const fileCategory = getFileCategory(fileType);
        
        // Create thumbnail for images
        let thumbnailUrl = null;
        let fileWidth = null;
        let fileHeight = null;
        
        if (fileCategory === 'image') {
          const { thumbnailName, width, height } = await createThumbnail(buffer, fileName);
          if (thumbnailName) {
            thumbnailUrl = `/uploads/thumbnails/${thumbnailName}`;
            fileWidth = width;
            fileHeight = height;
          }
        }

        // Create file URL
        const fileUrl = `/uploads/${uniqueFileName}`;

        // Store in main chat_app table
        const result = await pool.query(
          `INSERT INTO chat_app (
            row_type, username, room_id, message_text, is_read, is_emoji,
            file_name, file_type, file_size, file_url, thumbnail_url,
            file_category, file_width, file_height,
            reply_to_id, reply_to_username, reply_to_text
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
           RETURNING id, username, message_text, created_at, is_read, is_emoji,
                     file_name, file_type, file_size, file_url, thumbnail_url,
                     file_category, file_width, file_height,
                     reply_to_id, reply_to_username, reply_to_text`,
          [
            "message", username, roomId, fileName, false, false,
            fileName, fileType, fileSize, fileUrl, thumbnailUrl,
            fileCategory, fileWidth, fileHeight,
            replyToId || null, replyToUsername || null, replyToText || null
          ]
        );

        // Also store in chat_media table for gallery
        await pool.query(
          `INSERT INTO chat_media (
            message_id, room_id, username, file_name, file_type, 
            file_size, file_url, thumbnail_url, file_category
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            result.rows[0].id, roomId, username, fileName, fileType,
            fileSize, fileUrl, thumbnailUrl, fileCategory
          ]
        );

        io.to(roomId).emit("file_received", result.rows[0]);
      } catch (error) {
        console.error("send_file error:", error);
      }
    });

    // GET MEDIA GALLERY
    socket.on("get_media_gallery", async ({ roomId }) => {
      try {
        const gallery = await pool.query(
          `SELECT cm.*, ca.created_at
           FROM chat_media cm
           JOIN chat_app ca ON cm.message_id = ca.id
           WHERE cm.room_id = $1
           ORDER BY ca.created_at DESC`,
          [roomId]
        );
        
        socket.emit("media_gallery_data", gallery.rows);
      } catch (error) {
        console.error("get_media_gallery error:", error);
      }
    });

    // GET FILE INFO
    socket.on("get_file_info", async ({ messageId }) => {
      try {
        const result = await pool.query(
          `SELECT * FROM chat_app WHERE id = $1`,
          [messageId]
        );
        
        if (result.rows.length > 0) {
          socket.emit("file_info_data", result.rows[0]);
        }
      } catch (error) {
        console.error("get_file_info error:", error);
      }
    });

    // SEND REPLY
    socket.on("send_reply", async ({ 
      text, 
      roomId, 
      replyToId, 
      replyToUsername, 
      replyToText 
    }) => {
      try {
        const { username } = socket.data;
        if (!username || !roomId) return;

        const result = await pool.query(
          `INSERT INTO chat_app (row_type, username, room_id, message_text, is_read,
                                  reply_to_id, reply_to_username, reply_to_text)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, username, message_text, created_at, is_read,
                     reply_to_id, reply_to_username, reply_to_text`,
          ["message", username, roomId, text, false, 
           replyToId, replyToUsername, replyToText]
        );

        io.to(roomId).emit("reply_sent", result.rows[0]);
      } catch (error) {
        console.error("send_reply error:", error);
      }
    });

    // DELETE MESSAGE
    socket.on("delete_message", async ({ messageId, roomId, deleteForEveryone = false }) => {
      try {
        const { username } = socket.data;
        
        const checkResult = await pool.query(
          `SELECT username, file_url, thumbnail_url FROM chat_app WHERE id = $1`,
          [messageId]
        );

        if (checkResult.rows.length === 0) {
          console.log("Message not found");
          return;
        }

        const messageOwner = checkResult.rows[0].username;
        const fileUrl = checkResult.rows[0].file_url;
        const thumbnailUrl = checkResult.rows[0].thumbnail_url;
        
        if (!deleteForEveryone && messageOwner !== username) {
          console.log("Unauthorized deletion attempt");
          return;
        }

        // Delete files from disk
        if (fileUrl) {
          const filePath = path.join(__dirname, '..', fileUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        if (thumbnailUrl) {
          const thumbPath = path.join(__dirname, '..', thumbnailUrl);
          if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
          }
        }

        // Delete from media gallery table
        await pool.query(
          `DELETE FROM chat_media WHERE message_id = $1`,
          [messageId]
        );

        // Delete from main table
        await pool.query(
          `DELETE FROM chat_app WHERE id = $1`,
          [messageId]
        );

        // Broadcast deletion to room
        io.to(roomId).emit("message_deleted", { messageId });
      } catch (error) {
        console.error("delete_message error:", error);
      }
    });

    // READ RECEIPTS
    socket.on("mark_read", async ({ messageIds, roomId }) => {
      try {
        if (!messageIds.length) return;
        await pool.query(
          "UPDATE chat_app SET is_read = true WHERE id = ANY($1)",
          [messageIds]
        );
        io.to(roomId).emit("messages_read", { messageIds });
      } catch (error) {
        console.error("Read receipt error:", error);
      }
    });

    // TYPING
    socket.on("typing", (status: boolean) => {
      const { username, roomId } = socket.data;
      if (username && roomId) {
        socket.to(roomId).emit("typing", { username, status });
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      const { username, roomId } = socket.data;
      if (username) {
        onlineUsers.delete(username);
        if (roomId) {
          io.to(roomId).emit("user_status", { username, status: "offline" });
        }
      }
    });
  });
};