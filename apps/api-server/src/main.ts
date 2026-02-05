import "reflect-metadata";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { initSocket } from "./socket";
import calendarRoutes from "./modules/calendar/calendar.routes";
import { AppDataSource } from "./config/data-source";
import { pool } from "./db";

dotenv.config();

const app = express();
const server = http.createServer(app);

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 🔑 JSON parser (must be before routes)
app.use(express.json());

// 📁 Serve uploaded files statically
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io); // ✅ unchanged socket logic

/* ================= ROUTES ================= */
app.get("/", (_req, res) => {
  res.send("🚀 Backend running successfully");
});

// 🔍 DB health check
app.get("/db-test", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ dbTime: result.rows[0] });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "Database not connected" });
  }
});

/* ================= START SERVER AFTER DB ================= */
const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ TypeORM connected");
    console.log(
      "📦 Entities:",
      AppDataSource.entityMetadatas.map(e => e.name)
    );

    // ✅ Load routes AFTER DB is ready
    app.use("/api/v1/calendar", calendarRoutes);

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
