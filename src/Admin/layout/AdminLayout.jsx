import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
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
