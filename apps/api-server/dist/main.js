"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const socket_1 = require("./socket");
const calendar_routes_1 = __importDefault(require("./modules/calendar/calendar.routes"));
const data_source_1 = require("./config/data-source");
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
(0, socket_1.initSocket)(io);
app.get("/", (_req, res) => {
    res.send("🚀 Backend running successfully");
});
app.get("/db-test", async (_req, res) => {
    try {
        const result = await db_1.pool.query("SELECT NOW()");
        res.json({ dbTime: result.rows[0] });
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: "Database not connected" });
    }
});
const PORT = process.env.PORT || 5000;
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ TypeORM connected");
    console.log("📦 Entities:", data_source_1.AppDataSource.entityMetadatas.map(e => e.name));
    app.use("/api/v1/calendar", calendar_routes_1.default);
    server.listen(PORT, () => {
        console.log(`
✅ Server running
--------------------------------
HTTP   : http://localhost:${PORT}
Socket : ENABLED
Uploads: http://localhost:${PORT}/uploads
--------------------------------
`);
    });
})
    .catch((err) => {
    console.error("❌ DB connection failed", err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map