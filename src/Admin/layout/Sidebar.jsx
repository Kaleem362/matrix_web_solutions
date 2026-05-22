import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { getApiBase } from "../../utils/api.js";
import { getUnreadCount } from "../../utils/seenItems.js";
import io from "socket.io-client";
import { BsMegaphone } from "react-icons/bs";
import matrixlogo from "../../../dist/assets/MWW3dLogo-B4uGzW_u.png";
import { FaBlog,FaPhoenixFramework,FaServicestack   } from "react-icons/fa";
import { PiQuotesFill } from "react-icons/pi";
import { VscFeedback } from "react-icons/vsc";
import { RiContactsLine } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";




const menu = [
  { name: "Dashboard", path: "/admin/dashboard", badgeKey: null, icon: <MdDashboard /> },
  { name: "Contacts", path: "/admin/getContacts", badgeKey: "contacts", icon: <RiContactsLine /> },
  { name: "Testimonials", path: "/admin/testimonials", badgeKey: "testimonials", icon: <VscFeedback /> },
  { name: "Services", path: "/admin/services", badgeKey: null, icon: <FaServicestack /> },
  { name: "Our Work", path: "/admin/ourwork", badgeKey: null, icon: <FaPhoenixFramework /> },
  { name: "Quotes", path: "/admin/quotes", badgeKey: "quotes", icon: <PiQuotesFill /> },
  { name: "Ads", path: "/admin/ads", badgeKey: null, icon: <BsMegaphone /> },
  { name: "Blog", path: "/admin/blog", badgeKey: null, icon: <FaBlog /> },
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
        axios.get(`${API_BASE}/api/contact`, { withCredentials: true }).catch(() => ({ data: { data: [] } })),
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
      <img src={matrixlogo} alt="Logo" className="h-30 w-30 mr-2 opacity-20 absolute bottom-10 left-15" />
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-indigo-500">
        <img src={matrixlogo} alt="Logo" className="h-12 w-12 mr-2" />
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
            <span className="flex items-center gap-3">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              {item.name}
            </span>
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