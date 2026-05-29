import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/* =====================================================
   Shared admin shell
   - Sidebar (fixed, indigo-700)
   - Topbar (white, sticky)
   - Main area on bg-gray-100 with google-sans font
   All admin pages inherit the font + light background
   from this layout, so child components don't need to
   re-declare them.
===================================================== */
const AdminLayout = ({ children }) => {
  return (
    <div className="flex google-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="ml-64 flex-1 min-h-screen bg-gray-100">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
