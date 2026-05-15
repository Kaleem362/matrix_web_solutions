import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { getApiBase } from "../../utils/api.js";
import { getUnreadCount } from "../../utils/seenItems.js";
import io from "socket.io-client";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", badgeKey: null },
  { name: "Contacts", path: "/admin/getContacts", badgeKey: "contacts" },
  { name: "Testimonials", path: "/admin/testimonials", badgeKey: "testimonials" },
  { name: "Services", path: "/admin/services", badgeKey: null },
  { name: "Our Work", path: "/admin/ourwork", badgeKey: null },
  { name: "Quotes", path: "/admin/quotes", badgeKey: "quotes" },
];

const Sidebar = () => {
  const [badgeCounts, setBadgeCounts] = useState({
    contacts: 0,
    testimonials: 0,
    quotes: 0,
  });
  const [socket, setSocket] = useState(null);

  const fetchBadgeCounts = async () => {
    try {
      const API_BASE = getApiBase();

      const [quotesRes, contactsRes, testimonialsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/quotes`, { withCredentials: true }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_BASE}/api/contacts`, { withCredentials: true }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_BASE}/api/testimonials`, { withCredentials: true }).catch(() => ({ data: { data: [] } })),
      ]);

      const quotes = quotesRes.data.data || [];
      const contacts = contactsRes.data.data || contactsRes.data || [];
      const testimonials = testimonialsRes.data.data || [];

      setBadgeCounts({
        contacts: getUnreadCount("contacts", contacts),
        testimonials: getUnreadCount("testimonials", testimonials),
        quotes: getUnreadCount("quotes", quotes),
      });
    } catch (err) {
      console.error("Failed to fetch badge counts:", err);
    }
  };

  useEffect(() => {
    fetchBadgeCounts();

    const API_BASE = getApiBase();
    const socketInstance = io(API_BASE, { withCredentials: true });
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      socketInstance.emit("joinAdmin");
    });

    const handleUpdate = () => fetchBadgeCounts();

    socketInstance.on("dashboardStatsUpdated", handleUpdate);
    socketInstance.on("newQuoteSubmitted", handleUpdate);
    socketInstance.on("newContactSubmitted", handleUpdate);
    socketInstance.on("newTestimonialSubmitted", handleUpdate);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <aside className="w-64 h-screen bg-indigo-700 text-white fixed left-0 top-0">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-indigo-500">
        Matrix Admin
      </div>

      <nav className="mt-6 flex flex-col gap-1 px-3">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition flex items-center justify-between font-semibold ${
                isActive
                  ? "bg-white text-indigo-700"
                  : "hover:bg-indigo-600"
              }`
            }
          >
            <span>{item.name}</span>
            {item.badgeKey && badgeCounts[item.badgeKey] > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
                {badgeCounts[item.badgeKey] > 99 ? "99+" : badgeCounts[item.badgeKey]}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;