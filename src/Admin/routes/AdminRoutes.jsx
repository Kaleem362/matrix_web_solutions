import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Topbar from "../layout/Topbar";
import Sidebar from "../layout/Sidebar";
import Testimonials from "../Components/Testimonials";
import ClientContacts from "../Components/ClientContacts";
import Services from "../Components/ServiceComponents/Services";
import Quotes from "../Components/Quotes";
import OurWork from "../Components/OurWork";



const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/testimonials"
        element={
          <div>
            <Topbar></Topbar>
            <Sidebar />
            <div className="google-sans">
              <Testimonials />
            </div>
          </div>
        }
      />
      <Route
        path="/getContacts"
        element={
          <div>
            <Topbar></Topbar>
            <Sidebar />
            <div>
              <ClientContacts />
            </div>
          </div>
        }
      />
      {/* FIX: Render Quotes component instead of placeholder text. */}
      <Route path="/quotes" element={<Quotes />} />
      <Route
        path="/ourwork"
        element={
          <div>
            <Topbar></Topbar>
            <Sidebar />
            <div>
              <OurWork />
            </div>
          </div>
        }
      />
      <Route
        path="/services"
        element={
          <div>
            <Topbar></Topbar>
            <Sidebar />
            <div>
              <Services />
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
