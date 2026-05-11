import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import axios from "axios";
import { getApiBase } from "../../utils/api.js";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTestimonials: 0,
    pendingTestimonials: 0,
    totalQuotes: 0,
    activeServices: 0,
    totalContacts: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE = getApiBase();

        // Use axios with credentials for all requests
        const [testimonialsRes, quotesRes, servicesRes, contactsRes] =
          await Promise.all([
            axios.get(`${API_BASE}/api/testimonials/all`, { withCredentials: true }),
            axios.get(`${API_BASE}/api/quotes`, { withCredentials: true }),
            axios.get(`${API_BASE}/api/services`, { withCredentials: true }),
            axios.get(`${API_BASE}/api/contact`, { withCredentials: true }),
          ]);

        // Log response status for debugging
        console.log("📊 Response status:", {
          testimonials: testimonialsRes.status,
          quotes: quotesRes.status,
          services: servicesRes.status,
          contacts: contactsRes.status,
        });

        // If any response is 401, user needs to re-login
        if ([testimonialsRes, quotesRes, servicesRes, contactsRes].some(r => r.status === 401)) {
          setError("Session expired. Please log out and log back in.");
          setLoading(false);
          return;
        }

        // --- Testimonials ---
        const testimonialsData = testimonialsRes.data;
        const allTestimonials = Array.isArray(testimonialsData)
          ? testimonialsData
          : testimonialsData.data ?? testimonialsData.testimonials ?? [];
        const pending = allTestimonials.filter(
          (t) => t.status === "pending" || t.approved === false
        );

        // --- Quotes ---
        const quotesData = quotesRes.data;
        const allQuotes = Array.isArray(quotesData)
          ? quotesData
          : quotesData.data ?? quotesData.quotes ?? [];

        // --- Services ---
        const servicesData = servicesRes.data;
        const allServices = Array.isArray(servicesData)
          ? servicesData
          : servicesData.data ?? servicesData.services ?? [];
        const activeServices = allServices.filter(
          (s) => s.isActive === true || s.status === "active"
        );

        // --- Contacts ---
        const contactsData = contactsRes.data;
        const allContacts = Array.isArray(contactsData)
          ? contactsData
          : contactsData.data ?? contactsData.contacts ?? [];

        setStats({
          totalTestimonials: allTestimonials.length,
          pendingTestimonials: pending.length,
          totalQuotes: allQuotes.length,
          activeServices: activeServices.length,
          totalContacts: allContacts.length,
        });

        // Build recent activity from latest entries across collections
        const activity = [
          ...allTestimonials.slice(-3).map((t) => ({
            label: `Testimonial by ${t.name ?? "someone"} — ${t.status ?? (t.approved ? "approved" : "pending")}`,
            date: t.createdAt,
          })),
          ...allQuotes.slice(-2).map((q) => ({
            label: `Quote request from ${q.name ?? q.email ?? "a client"}`,
            date: q.createdAt,
          })),
          ...allContacts.slice(-2).map((c) => ({
            label: `Contact message from ${c.name ?? c.email ?? "someone"}`,
            date: c.createdAt,
          })),
        ]
          .filter((a) => a.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);

        setRecentActivity(activity);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        // Handle axios errors
        if (err.response?.status === 401) {
          setError("Session expired. Please log out and log back in.");
        } else {
          setError("Failed to load dashboard data. Is the server running?");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Testimonials",
      value: stats.totalTestimonials,
      subtitle: "Approved + Pending",
    },
    {
      title: "Pending Testimonials",
      value: stats.pendingTestimonials,
      subtitle: "Need approval",
    },
    {
      title: "Total Quotes",
      value: stats.totalQuotes,
      subtitle: "Client requests",
    },
    {
      title: "Active Services",
      value: stats.activeServices,
      subtitle: "Currently visible",
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 google-sans">
        {statCards.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              {loading ? (
                <span className="inline-block w-8 h-7 bg-gray-200 animate-pulse rounded" />
              ) : (
                item.value
              )}
            </h2>
            <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-5 col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          {loading ? (
            <ul className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <li key={i} className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
              ))}
            </ul>
          ) : recentActivity.length > 0 ? (
            <ul className="text-sm text-gray-600 space-y-2">
              {recentActivity.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>
                    {a.label}
                    {a.date && (
                      <span className="text-gray-400 ml-2 text-xs">
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No recent activity found.</p>
          )}
        </div>

        {/* Quick Info */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Info</h3>
          <ul className="text-sm text-gray-600 space-y-3">
            <li className="flex justify-between">
              <span>Total Contacts</span>
              <span className="font-semibold text-gray-800">
                {loading ? "..." : stats.totalContacts}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Pending Approvals</span>
              <span className="font-semibold text-orange-500">
                {loading ? "..." : stats.pendingTestimonials}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Active Services</span>
              <span className="font-semibold text-green-600">
                {loading ? "..." : stats.activeServices}
              </span>
            </li>
          </ul>
          <p className="text-xs text-gray-400 mt-4 border-t pt-3">
            Manage content, approve testimonials, and respond to client quotes
            from the sidebar.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;