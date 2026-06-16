import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* =============================
   PUBLIC WEBSITE COMPONENTS
   ============================= */
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import ServicesSection from "../Components/ServicesSection";
import QuoteModal from "../Components/QuoteModal";
import OurWorkSection from "../Components/OurWorkSection";
import TestimonialsSection from "../Components/TestimonialsSection";
import { InlineAd, SidebarAd } from "./Components/AdComponents";
import Footer from "../Components/Footer";
import PricingSection from "../Components/PricingSection";
import ProcessSection from "../Components/ProcessSection";
import FAQSection from "../Components/FAQSection";
import ServiceDetailsModal from "../Components/ServiceDetailsModal";
import TestimonialForm from "../Components/TestimonialForm";
import ProtectedRoute from "./Admin/Components/ProtectedRoute";
import PublicRoute from "./Admin/Components/PublicRoute"; // ✅ PUBLIC ROUTE COMPONENT
import OurServicesPage from "../Pages/OurServicesPage";
import Projectspage from "../Pages/Projectspage";
import AboutPage from "../Pages/AboutPage";
import BlogList from "../Pages/BlogList";
import BlogDetail from "../Pages/BlogDetail";
import ContactPage from "../Pages/ContactPage";

/* =============================
   PAYMENT COMPONENTS
   ============================= */
import PaymentModal from "../Components/PaymentModal"; // Stripe payment modal
import { PopupAd, FloatingAd } from "./Components/AdComponents"; // Advertisement display

/* =============================
   ADMIN / AUTH PAGES
   ============================= */
import AdminRoutes from "./Admin/routes/AdminRoutes";
import Login from "../src/Admin/pages/Login";
// import Signup from "../src/Admin/pages/Signup";/ // ✅ SIGNUP PAGE
import Signup from "../src/Admin/pages/SignUp";
import ResetPassword from "../src/Admin/pages/ResetPassword";

const App = () => {
  return (
    <BrowserRouter>
      {/* Toast Notifications - Beautiful alert replacements */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={20}
        containerStyle={{
          top: 60,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            padding: "14px 20px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            style: {
              background: "#10b981",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
      />

      {/* Global Modals - Available on all pages */}
      <QuoteModal />
      <ServiceDetailsModal />
      {/* Payment Modal - Appears after client accepts quote */}
      <PaymentModal />
      {/* Popup Ad - Shows on all pages after 3 seconds */}
      <PopupAd />

      <Routes>
        {/* 🌍 PUBLIC WEBSITE */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <ServicesSection />
              {/* Inline Advertisement */}
              <InlineAd />
              {/* Sidebar Advertisement */}
              <div className="container mx-auto px-4">
                <SidebarAd />
              </div>
              <OurWorkSection />
              <TestimonialsSection />
              <TestimonialForm />
              <PricingSection />
              <ProcessSection />
              <FAQSection />
              {/* Floating Advertisement */}
              <FloatingAd />
              <Footer />
            </>
          }
        />
        <Route
          path="/our-services"
          element={
            <>
              <Navbar />
              <OurServicesPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/projects"
          element={
            <>
              <Navbar />
              <Projectspage />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <ContactPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <AboutPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/blog"
          element={
            <>
              <Navbar />
              <BlogList />
              <Footer />
            </>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <>
              <Navbar />
              <BlogDetail />
              <Footer />
            </>
          }
        />
        {/* 🔓 AUTH ROUTES (PUBLIC) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* ✅ ADDED */}
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        {/* 🔐 ADMIN PANEL (PROTECTED INSIDE) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
