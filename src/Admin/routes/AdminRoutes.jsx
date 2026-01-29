import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Topbar from "../layout/Topbar";
import Sidebar from "../layout/Sidebar";
import Testimonials from "../Components/Testimonials/Testimonials";

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
      <Route path="/quotes" element={<div>Quotes Management Page</div>} />
      <Route path="/services" element={<div>Services Management Page</div>} />
    </Routes>
  );
};

export default AdminRoutes;
