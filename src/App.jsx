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
import AdminRoutes from "./Admin/routes/AdminRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
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
                <PricingSection />
                <ProcessSection />
                <FAQSection />
                <Footer />
                <ServiceDetailsModal />
              </>
            }
            />
            <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
