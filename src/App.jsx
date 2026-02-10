import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

/* =============================
   PUBLIC WEBSITE COMPONENTS
   ============================= */
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import ServicesSection from "../Components/ServicesSection";
import QuoteModal from "../Components/QuoteModal";
import OurWorkSection from "../Components/OurWorkSection";
import TestimonialsSection from "../Components/TestimonialsSection";
import Footer from "../Components/Footer";
import PricingSection from "../Components/PricingSection";
import ProcessSection from "../Components/ProcessSection";
import FAQSection from "../Components/FAQSection";
import ServiceDetailsModal from "../Components/ServiceDetailsModal";
import TestimonialForm from "../Components/TestimonialForm";

/* =============================
   ADMIN / AUTH PAGES
   ============================= */
import AdminRoutes from "./Admin/routes/AdminRoutes";
import Login from "../src/Admin/pages/Login";
import Signup from "../src/Admin/pages/Signup"; // ✅ SIGNUP PAGE

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌍 PUBLIC WEBSITE */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <ServicesSection />
              <QuoteModal />
              <OurWorkSection />
              <TestimonialsSection />
              <TestimonialForm />
              <PricingSection />
              <ProcessSection />
              <FAQSection />
              <Footer />
              <ServiceDetailsModal />
            </>
          }
        />

        {/* 🔓 AUTH ROUTES (PUBLIC) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* ✅ ADDED */}

        {/* 🔐 ADMIN PANEL (PROTECTED INSIDE) */}
        <Route path="/admin/*" element={<AdminRoutes />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
