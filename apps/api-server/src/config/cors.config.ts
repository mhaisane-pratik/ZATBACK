// src/config/cors.config.ts
import cors from "cors";

const corsOptions = {
  origin: [
    "http://localhost:5173", // Local dev
    "https://statuesque-flan-c818f0.netlify.app", // Netlify production
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};

export const corsMiddleware = cors(corsOptions);