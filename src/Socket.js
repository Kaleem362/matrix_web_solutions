import { io } from "socket.io-client";

// 🔹 Backend socket server URL
const SOCKET_URL = import.meta.env.VITE_API_URL;
console.log("SOCKET URL:", import.meta.env.VITE_API_URL);
// 🔹 Single socket instance (singleton)
export const socket = io(SOCKET_URL, {
  
  autoConnect: true,
  transports: ["websocket"],
});
