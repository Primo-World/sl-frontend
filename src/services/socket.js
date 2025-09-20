import { io } from "socket.io-client";
import { SOCKET_URL } from "@env"; // 👈 pulled from .env

// Initialize socket connection
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // more stable for React Native
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  autoConnect: true,
});

// Log when connected
socket.on("connect", () => {
  console.log("🟢 Connected to backend Socket.IO:", socket.id);
});

// Log errors
socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

// Log disconnection
socket.on("disconnect", (reason) => {
  console.log("🔴 Socket disconnected:", reason);
});

export default socket;
