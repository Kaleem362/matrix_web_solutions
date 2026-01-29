import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Testimonials", path: "/admin/testimonials" },
  { name: "Services", path: "/admin/services" },
  { name: "Our Work", path: "/admin/ourwork" },
  { name: "Quotes", path: "/admin/quotes" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-indigo-700 text-white fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-indigo-500">
        Matrix Admin
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col gap-1 px-3">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-white text-indigo-700 font-semibold"
                  : "hover:bg-indigo-600"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
