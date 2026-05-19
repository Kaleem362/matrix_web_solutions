/* ========================================================================
   SOCKET SERVICE - Real-time ad analytics
   ========================================================================
   This service connects to Socket.IO server and listens for:
   - adViewed: When an ad is viewed on public website
   - adClicked: When an ad is clicked on public website

   Usage:
   import { connectAdSocket, disconnectAdSocket, onAdUpdate } from "./socketService";
   ======================================================================== */

import { io } from "socket.io-client";

let socket = null;

/* ========================================================================
   Function: connectAdSocket
   Description: Connect to Socket.IO server for real-time ad updates
   Returns: Socket instance
   ======================================================================== */
export const connectAdSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

  socket = io(socketUrl, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("🔌 Socket connected for ad analytics");
    socket.emit("joinAdmin");
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

/* ========================================================================
   Function: disconnectAdSocket
   Description: Disconnect from Socket.IO server
   ======================================================================== */
export const disconnectAdSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected");
  }
};

/* ========================================================================
   Function: onAdViewed
   Description: Listen for ad view events
   Parameters: callback - Function to call when ad is viewed
   ======================================================================== */
export const onAdViewed = (callback) => {
  if (socket) {
    socket.on("adViewed", (data) => {
      console.log("📊 Ad viewed (real-time):", data);
      callback(data);
    });
  }
};

/* ========================================================================
   Function: onAdClicked
   Description: Listen for ad click events
   Parameters: callback - Function to call when ad is clicked
   ======================================================================== */
export const onAdClicked = (callback) => {
  if (socket) {
    socket.on("adClicked", (data) => {
      console.log("📊 Ad clicked (real-time):", data);
      callback(data);
    });
  }
};

/* ========================================================================
   Function: removeAdListeners
   Description: Remove all ad event listeners
   ======================================================================== */
export const removeAdListeners = () => {
  if (socket) {
    socket.off("adViewed");
    socket.off("adClicked");
  }
};

export default {
  connectAdSocket,
  disconnectAdSocket,
  onAdViewed,
  onAdClicked,
  removeAdListeners,
};