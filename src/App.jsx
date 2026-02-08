import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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

import AdminRoutes from "./Admin/routes/AdminRoutes";
import Login from "../src/Admin/pages/Login"; //  LOGIN PAGE

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>

          {/*  PUBLIC WEBSITE */}
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

          {/* 🔓 LOGIN (PUBLIC) */}
          <Route path="/login" element={<Login />} />

          {/* 🔐 ADMIN PANEL */}
          <Route path="/admin/*" element={<AdminRoutes />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
