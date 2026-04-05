// src/utils/api.js
export const getApiBase = () => {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000";
  }
  const base = import.meta.env.VITE_API_URL || "https://your-backend.vercel.app";
  return base.endsWith("/") ? base.slice(0, -1) : base;
};