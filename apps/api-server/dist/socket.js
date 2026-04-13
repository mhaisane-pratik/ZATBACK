"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const db_1 = require("./db");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const sharp_1 = __importDefault(require("sharp"));
const writeFileAsync = (0, util_1.promisify)(fs_1.default.writeFile);
const mkdirAsync = (0, util_1.promisify)(fs_1.default.mkdir);
const existsAsync = (0, util_1.promisify)(fs_1.default.exists);
const onlineUsers = new Map();
const UPLOAD_DIR = path_1.default.join(__dirname, "../uploads");
const THUMBNAIL_DIR = path_1.default.join(__dirname, "../uploads/thumbnails");
const ensureUploadDirs = async () => {
    if (!fs_1.default.existsSync(UPLOAD_DIR))
        await mkdirAsync(UPLOAD_DIR, { recursive: true });
    if (!fs_1.default.existsSync(THUMBNAIL_DIR))
        await mkdirAsync(THUMBNAIL_DIR, { recursive: true });
};
ensureUploadDirs();
const generateUniqueId = () => (0, uuid_1.v4)();
const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};
const getFileCategory = (mimeType) => {
    if (mimeType.startsWith('image/'))
        return 'image';
    if (mimeType.startsWith('video/'))
        return 'video';
    if (mimeType.startsWith('audio/'))
        return 'audio';
    if (mimeType === 'application/pdf')
        return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document'))
        return 'document';
    if (mimeType.includes('sheet') || mimeType.includes('excel'))
        return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
        return 'presentation';
    if (mimeType.includes('zip') || mimeType.includes('compressed'))
        return 'archive';
    return 'file';
};
const createThumbnail = async (buffer, filename) => {
    try {
        const ext = getFileExtension(filename).toLowerCase();
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
        if (imageExts.includes(ext)) {
            const thumbnailName = `thumb_${(0, uuid_1.v4)()}.jpg`;
            const thumbnailPath = path_1.default.join(THUMBNAIL_DIR, thumbnailName);
            const image = (0, sharp_1.default)(buffer);
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
    }
    catch (error) {
        console.error("Thumbnail creation error:", error);
        return { thumbnailName: null };
    }
};
const initSocket = (io) => {
    io.on("connection", (socket) => {
        socket.on("join_room", async ({ username, roomId }) => {
            try {
                if (!username || !roomId)
                    return;
                socket.data.username = username;
                socket.data.roomId = roomId;
                onlineUsers.set(username, socket.id);
                socket.join(roomId);
                io.to(roomId).emit("user_status", { username, status: "online" });
                const history = await db_1.pool.query(`SELECT id, username, message_text, created_at, is_read, is_emoji,
                  reply_to_id, reply_to_username, reply_to_text,
                  file_name, file_type, file_size, file_url, thumbnail_url,
                  file_category, file_width, file_height
           FROM chat_app 
           WHERE row_type = 'message' AND room_id = $1 
           ORDER BY created_at ASC`, [roomId]);
                socket.emit("chat_history", history.rows);
            }
            catch (error) {
                console.error("join_room error:", error);
            }
        });
        socket.on("send_message", async (data) => {
            try {
                const { username, roomId } = socket.data;
                const { text, isEmoji = false } = data;
                if (!username || !roomId || !text)
                    return;
                const result = await db_1.pool.query(`INSERT INTO chat_app (row_type, username, room_id, message_text, is_read, is_emoji)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, username, message_text, created_at, is_read, is_emoji`, ["message", username, roomId, text, false, isEmoji]);
                io.to(roomId).emit("receive_message", result.rows[0]);
            }
            catch (error) {
                console.error("send_message error:", error);
            }
        });
        socket.on("send_file", async (fileData) => {
            try {
                const { username } = socket.data;
                const { fileName, fileType, fileSize, fileData: base64Data, roomId, replyToId, replyToUsername, replyToText } = fileData;
                if (!username || !roomId)
                    return;
                const fileId = (0, uuid_1.v4)();
                const fileExtension = getFileExtension(fileName);
                const uniqueFileName = `${fileId}.${fileExtension}`;
                const filePath = path_1.default.join(UPLOAD_DIR, uniqueFileName);
                const buffer = Buffer.from(base64Data, 'base64');
                await writeFileAsync(filePath, buffer);
                const fileCategory = getFileCategory(fileType);
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
                const fileUrl = `/uploads/${uniqueFileName}`;
                const result = await db_1.pool.query(`INSERT INTO chat_app (
            row_type, username, room_id, message_text, is_read, is_emoji,
            file_name, file_type, file_size, file_url, thumbnail_url,
            file_category, file_width, file_height,
            reply_to_id, reply_to_username, reply_to_text
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
           RETURNING id, username, message_text, created_at, is_read, is_emoji,
                     file_name, file_type, file_size, file_url, thumbnail_url,
                     file_category, file_width, file_height,
                     reply_to_id, reply_to_username, reply_to_text`, [
                    "message", username, roomId, fileName, false, false,
                    fileName, fileType, fileSize, fileUrl, thumbnailUrl,
                    fileCategory, fileWidth, fileHeight,
                    replyToId || null, replyToUsername || null, replyToText || null
                ]);
                await db_1.pool.query(`INSERT INTO chat_media (
            message_id, room_id, username, file_name, file_type, 
            file_size, file_url, thumbnail_url, file_category
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
                    result.rows[0].id, roomId, username, fileName, fileType,
                    fileSize, fileUrl, thumbnailUrl, fileCategory
                ]);
                io.to(roomId).emit("file_received", result.rows[0]);
            }
            catch (error) {
                console.error("send_file error:", error);
            }
        });
        socket.on("get_media_gallery", async ({ roomId }) => {
            try {
                const gallery = await db_1.pool.query(`SELECT cm.*, ca.created_at
           FROM chat_media cm
           JOIN chat_app ca ON cm.message_id = ca.id
           WHERE cm.room_id = $1
           ORDER BY ca.created_at DESC`, [roomId]);
                socket.emit("media_gallery_data", gallery.rows);
            }
            catch (error) {
                console.error("get_media_gallery error:", error);
            }
        });
        socket.on("get_file_info", async ({ messageId }) => {
            try {
                const result = await db_1.pool.query(`SELECT * FROM chat_app WHERE id = $1`, [messageId]);
                if (result.rows.length > 0) {
                    socket.emit("file_info_data", result.rows[0]);
                }
            }
            catch (error) {
                console.error("get_file_info error:", error);
            }
        });
        socket.on("send_reply", async ({ text, roomId, replyToId, replyToUsername, replyToText }) => {
            try {
                const { username } = socket.data;
                if (!username || !roomId)
                    return;
                const result = await db_1.pool.query(`INSERT INTO chat_app (row_type, username, room_id, message_text, is_read,
                                  reply_to_id, reply_to_username, reply_to_text)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, username, message_text, created_at, is_read,
                     reply_to_id, reply_to_username, reply_to_text`, ["message", username, roomId, text, false,
                    replyToId, replyToUsername, replyToText]);
                io.to(roomId).emit("reply_sent", result.rows[0]);
            }
            catch (error) {
                console.error("send_reply error:", error);
            }
        });
        socket.on("delete_message", async ({ messageId, roomId, deleteForEveryone = false }) => {
            try {
                const { username } = socket.data;
                const checkResult = await db_1.pool.query(`SELECT username, file_url, thumbnail_url FROM chat_app WHERE id = $1`, [messageId]);
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
                if (fileUrl) {
                    const filePath = path_1.default.join(__dirname, '..', fileUrl);
                    if (fs_1.default.existsSync(filePath)) {
                        fs_1.default.unlinkSync(filePath);
                    }
                }
                if (thumbnailUrl) {
                    const thumbPath = path_1.default.join(__dirname, '..', thumbnailUrl);
                    if (fs_1.default.existsSync(thumbPath)) {
                        fs_1.default.unlinkSync(thumbPath);
                    }
                }
                await db_1.pool.query(`DELETE FROM chat_media WHERE message_id = $1`, [messageId]);
                await db_1.pool.query(`DELETE FROM chat_app WHERE id = $1`, [messageId]);
                io.to(roomId).emit("message_deleted", { messageId });
            }
            catch (error) {
                console.error("delete_message error:", error);
            }
        });
        socket.on("mark_read", async ({ messageIds, roomId }) => {
            try {
                if (!messageIds.length)
                    return;
                await db_1.pool.query("UPDATE chat_app SET is_read = true WHERE id = ANY($1)", [messageIds]);
                io.to(roomId).emit("messages_read", { messageIds });
            }
            catch (error) {
                console.error("Read receipt error:", error);
            }
        });
        socket.on("typing", (status) => {
            const { username, roomId } = socket.data;
            if (username && roomId) {
                socket.to(roomId).emit("typing", { username, status });
            }
        });
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
exports.initSocket = initSocket;
//# sourceMappingURL=socket.js.map