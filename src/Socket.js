import { io } from "socket.io-client";

// 🔹 Backend socket server URL
const SOCKET_URL = "http://localhost:5000";

// 🔹 Single socket instance (singleton)
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
});
