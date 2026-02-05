import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection event listeners (optional)
socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});