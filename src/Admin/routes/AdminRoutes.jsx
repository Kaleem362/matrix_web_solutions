import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Topbar from "../layout/Topbar";
import Sidebar from "../layout/Sidebar";
import Testimonials from "../Components/Testimonials";
import Quotes from "../Components/Quotes";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/testimonials" element={<div>
        <Topbar></Topbar>
        <Sidebar />
        <div>
            <Testimonials/>
        </div>
      </div>} />
      {/* FIX: Render Quotes component instead of placeholder text. */}
      <Route path="/quotes" element={<Quotes />} />
      <Route path="/services" element={<div>Services Management Page</div>} />
    </Routes>
  );
};

export default AdminRoutes;
