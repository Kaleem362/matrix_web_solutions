import { NavLink } from "react-router-dom";
import { useDashboard } from "../../Context/DashboardContext";
import { BsMegaphone } from "react-icons/bs";
import matrixlogo from "../../../dist/assets/MWW3dLogo-B4uGzW_u.png";
import { FaBlog, FaPhoenixFramework, FaServicestack } from "react-icons/fa";
import { PiQuotesFill } from "react-icons/pi";
import { VscFeedback } from "react-icons/vsc";
import { RiContactsLine } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";

const menu = [
  { name: "Dashboard",    path: "/admin/dashboard",   badgeKey: null,           icon: <MdDashboard /> },
  { name: "Contacts",     path: "/admin/getContacts", badgeKey: "contacts",     icon: <RiContactsLine /> },
  { name: "Testimonials", path: "/admin/testimonials",badgeKey: "testimonials", icon: <VscFeedback /> },
  { name: "Services",     path: "/admin/services",    badgeKey: null,           icon: <FaServicestack /> },
  { name: "Our Work",     path: "/admin/ourwork",     badgeKey: null,           icon: <FaPhoenixFramework /> },
  { name: "Quotes",       path: "/admin/quotes",      badgeKey: "quotes",       icon: <PiQuotesFill /> },
  { name: "Ads",          path: "/admin/ads",         badgeKey: null,           icon: <BsMegaphone /> },
  { name: "Blog",         path: "/admin/blog",        badgeKey: null,           icon: <FaBlog /> },
];

const Sidebar = () => {
  // ✅ Reads badges from context — no socket, no API calls here
  const { badges } = useDashboard();

  return (
    <aside className="w-64 h-screen bg-indigo-700 text-white fixed left-0 top-0">
      {/* Watermark logo */}
      <img
        src={matrixlogo}
        alt="Logo"
        className="h-30 w-30 mr-2 ml-14"
      />

      {/* Header */}
      

      {/* Nav */}
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

            {/* ✅ Live badge from context */}
            {item.badgeKey && badges[item.badgeKey] > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
                {badges[item.badgeKey] > 99 ? "99+" : badges[item.badgeKey]}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;