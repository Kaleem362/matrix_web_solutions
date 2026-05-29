import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { getApiBase } from "../utils/api.js";
import { getUnreadCount } from "../utils/seenItems.js";

/* =====================================================
   📦 Context Creation
===================================================== */
const DashboardContext = createContext(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
};

/* =====================================================
   🔌 Provider
===================================================== */
export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalTestimonials: 0,
    pendingTestimonials: 0,
    totalQuotes: 0,
    activeServices: 0,
    totalContacts: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const [badges, setBadges] = useState({
    contacts: 0,
    testimonials: 0,
    quotes: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  /* =====================================================
     📊 Fetch Dashboard Stats + Badge Counts (parallel)
  ===================================================== */
  const fetchAll = useCallback(async () => {
    try {
      const API_BASE = getApiBase();

      const [dashRes, quotesRes, contactsRes, testimonialsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/dashboard/stats`, { withCredentials: true }),
        axios.get(`${API_BASE}/api/quotes`, { withCredentials: true }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_BASE}/api/contact`, { withCredentials: true }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_BASE}/api/testimonials`, { withCredentials: true }).catch(() => ({ data: { data: [] } })),
      ]);

      // ✅ Dashboard stats
      if (dashRes.data?.success) {
        setStats(dashRes.data.stats);
        setRecentActivity(dashRes.data.recentActivity || []);
      }

      // ✅ Badge counts (unread)
      const quotes = quotesRes.data.data || [];
      const contacts = contactsRes.data.data || contactsRes.data || [];
      const testimonials = testimonialsRes.data.data || [];

      setBadges({
        contacts: getUnreadCount("contacts", contacts),
        testimonials: getUnreadCount("testimonials", testimonials),
        quotes: getUnreadCount("quotes", quotes),
      });

    } catch (err) {
      console.error("❌ DashboardContext fetchAll error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log out and log back in.");
      } else {
        setError("Failed to load dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     🔌 Socket Connection (single, shared across admin)
  ===================================================== */
  useEffect(() => {
    // Initial data fetch
    fetchAll();

    const API_BASE = getApiBase();

    socketRef.current = io(API_BASE, {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 DashboardContext socket connected:", socketRef.current.id);
    });

    // ✅ Any stats change → re-fetch everything
    socketRef.current.on("dashboardStatsUpdated", () => {
      console.log("📊 dashboardStatsUpdated received → refetching");
      fetchAll();
    });

    // ✅ New contact submitted
    socketRef.current.on("newContactSubmitted", (newContact) => {
      console.log("📩 newContactSubmitted:", newContact?.name);
      // Increment badge immediately (optimistic)
      setBadges((prev) => ({ ...prev, contacts: prev.contacts + 1 }));
      // Refetch stats to keep counts accurate
      fetchAll();
    });

    // ✅ New quote submitted
    socketRef.current.on("newQuoteSubmitted", (newQuote) => {
      console.log("💬 newQuoteSubmitted:", newQuote?.name);
      setBadges((prev) => ({ ...prev, quotes: prev.quotes + 1 }));
      fetchAll();
    });

    // ✅ New testimonial submitted
    socketRef.current.on("newTestimonialSubmitted", () => {
      console.log("⭐ newTestimonialSubmitted received");
      setBadges((prev) => ({ ...prev, testimonials: prev.testimonials + 1 }));
      fetchAll();
    });

    // ✅ Contact deleted → re-sync
    socketRef.current.on("ContactDeleted", () => {
      console.log("🗑️ ContactDeleted received → refetching");
      fetchAll();
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 DashboardContext socket disconnected");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 DashboardContext socket cleaned up");
      }
    };
  }, [fetchAll]);

  /* =====================================================
     📤 Context Value
  ===================================================== */
  const value = {
    stats,
    recentActivity,
    badges,
    loading,
    error,
    refetch: fetchAll,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};