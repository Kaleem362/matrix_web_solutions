import { Routes, Route } from "react-router-dom";
import { DashboardProvider } from "../../Context/DashboardContext";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Testimonials from "../Components/Testimonials";
import ClientContacts from "../Components/ClientContacts";
import Services from "../Components/ServiceComponents/Services";
import Quotes from "../Components/Quotes";
import OurWork from "../Components/OurWork";
import Ads from "../Components/Ads";
import BlogManager from "../Components/BlogManager";

/* =====================================================
   ✅ Single shared layout wrapper for all admin routes
   DashboardProvider lives here — one socket, one fetch
===================================================== */
const AdminRoutes = () => {
  return (
    <DashboardProvider>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/testimonials"
          element={
            <AdminLayout>
              <Testimonials />
            </AdminLayout>
          }
        />
        <Route
          path="/getContacts"
          element={
            <AdminLayout>
              <ClientContacts />
            </AdminLayout>
          }
        />
        <Route
          path="/quotes"
          element={
            <AdminLayout>
              <Quotes />
            </AdminLayout>
          }
        />
        <Route
          path="/ads"
          element={
            <AdminLayout>
              <Ads />
            </AdminLayout>
          }
        />
        <Route
          path="/ourwork"
          element={
            <AdminLayout>
              <OurWork />
            </AdminLayout>
          }
        />
        <Route
          path="/services"
          element={
            <AdminLayout>
              <Services />
            </AdminLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <AdminLayout>
              <BlogManager />
            </AdminLayout>
          }
        />
      </Routes>
    </DashboardProvider>
  );
};

export default AdminRoutes;