import { div } from "framer-motion/client";
import React, { useState } from "react";

const Services = () => {
  const [Services, setService] = useState("ViewService");
  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-100 google-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Services</h2>
      </div>
      {/* buttons-div */}
      <div className="button-area w-full flex justify-start gap-4">
        <div>
          <button
            className="bg-white text-indigo-500 focus:from-indigo-500 focus:to-indigo-800 focus:bg-linear-to-r focus:text-white border border-indigo-500 px-4 py-2 rounded-full"
            onClick={() => setService("AddService")}
          >
            Add Service
          </button>
        </div>
        <div>
          <button
            className="bg-white text-indigo-500 focus:from-indigo-500 focus:to-indigo-800 focus:bg-linear-to-r focus:text-white border border-indigo-500 px-4 py-2 rounded-full"
            onClick={() => setService("EditService")}
          >
            Edit Service
          </button>
        </div>
        <div>
          <button
            className="bg-white text-indigo-500 focus:from-indigo-500 focus:to-indigo-800 focus:bg-linear-to-r focus:text-white border border-indigo-500 px-4 py-2 rounded-full"
            onClick={() => setService("DeleteService")}
          >
            Delete Service
          </button>
        </div>
        <div>
          <button
            className="bg-white text-indigo-500 focus:from-indigo-500 focus:to-indigo-800 focus:bg-linear-to-r focus:text-white border border-indigo-500 px-4 py-2 rounded-full"
            onClick={() => setService("ViewService")}
          >
            View Service
          </button>
        </div>
      </div>
      <div className="hero-container">
        <div className="view-services">
          {Services === "ViewService" && (
            <div className="service-card w-full">
              <h1>Fetch Services from the database and display them here.</h1>
            </div>
          )}
        </div>
        <div className="add-service">
          {Services === "AddService" && (
            <div className="add-services-form w-full h-screen  flex flex-col justify-center items-center ">
              <h1>Add Service</h1>
            </div>
          )}
        </div>
        <div className="edit-service">
          {Services === "EditService" && (
            <div className="edit-services-form w-full">
              <h1>Edit Service</h1>
            </div>
          )}
        </div>
        <div className="delete-service">
          {Services === "DeleteService" && (
            <div className="delete-services-form w-full">
              <h1>Delete Service</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
