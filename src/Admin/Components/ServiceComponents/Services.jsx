import { div } from "framer-motion/client";
import React, { useState } from "react";
import AddServicesForm from "./AddServicesForm";

const Services = () => {
  const [Services, setService] = useState("ViewService");
  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-100 google-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Services</h2>
      </div>
      {/* buttons-div */}

      <div className="hero-container">
        <div className="add-service">
          {Services === "AddService" && (
            <div className="add-services-form w-full">
              <AddServicesForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
