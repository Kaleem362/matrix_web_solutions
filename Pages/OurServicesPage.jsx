import React, { useEffect, useState } from "react";
import CoverOurServicesPage from "./coversforpages/CoverOurServicesPage";
import { useStore } from "../src/Context/UseStore";
import { FiMonitor, FiSmartphone, FiSearch, FiShield, FiCode, FiLayers, FiGlobe, FiShoppingCart, FiTrendingUp, FiMail, FiDatabase, FiCloud } from "react-icons/fi";
import { socket } from "../src/Socket.js";
import axios from "axios";
import { getApiBase } from "../src/utils/api.js";

const iconMap = {
  FiMonitor,
  FiSmartphone,
  FiSearch,
  FiShield,
  FiCode,
  FiLayers,
  FiGlobe,
  FiShoppingCart,
  FiTrendingUp,
  FiMail,
  FiDatabase,
  FiCloud,
};

const OurServicesPage = () => {
  const { isQuoteOpen, setIsQuoteOpen, whatsappicon } = useStore(useStore);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from API
  const fetchServices = async () => {
    try {
      const API_BASE = getApiBase();
      const res = await axios.get(`${API_BASE}/api/services`, {
        withCredentials: true,
      });
      const data = res.data.data || res.data || [];
      setServices(data.filter((s) => s.isActive !== false));
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();

    // Socket listeners for real-time updates
    socket.on("serviceCreated", (newService) => {
      console.log("New service received via socket:", newService);
      setServices((prev) => [newService, ...prev]);
    });

    socket.on("serviceUpdated", (updatedService) => {
      console.log("Service updated via socket:", updatedService);
      setServices((prev) =>
        prev.map((s) => (s._id === updatedService._id ? updatedService : s))
      );
    });

    socket.on("serviceDeleted", ({ id }) => {
      console.log("Service deleted via socket:", id);
      setServices((prev) => prev.filter((s) => s._id !== id));
    });

    return () => {
      socket.off("serviceCreated");
      socket.off("serviceUpdated");
      socket.off("serviceDeleted");
    };
  }, []);

  const stats = [
    { number: "150+", label: "Projects Delivered" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "5+", label: "Years Experience" },
    { number: "24/7", label: "Support Available" },
  ];

  const process = [
    {
      step: "01",
      title: "Discovery",
      description:
        "We analyze your business goals, target audience, and competition to create a strategic roadmap.",
    },
    {
      step: "02",
      title: "Design & Develop",
      description:
        "Our team crafts pixel-perfect designs and builds robust solutions aligned with your vision.",
    },
    {
      step: "03",
      title: "Launch & Support",
      description:
        "We deploy your project and provide ongoing maintenance to ensure continued success.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Cover */}
      <CoverOurServicesPage />

      {/* Stats Section */}
      <section className="bg-linear-to-r from-indigo-800 via-indigo-700 to-violet-700 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">
                  {stat.number}
                </p>
                <p className="text-indigo-200 text-sm md:text-base mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              What We Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              Our Services
            </h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Comprehensive digital solutions designed to help your business
              thrive in the modern online landscape.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse"
                >
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6">
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <p className="text-slate-500">
                No services available at the moment. Check back soon!
              </p>
            </div>
          ) : (
            /* Services Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service) => {
                const IconComponent = iconMap[service.icon] || FiCode;
                return (
                  <div
                    key={service._id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-indigo-200"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.serviceName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center">
                          <IconComponent className="w-20 h-20 text-white/30" />
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                      {/* Icon Badge */}
                      <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-indigo-600" />
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md">
                        <span className="text-sm font-bold text-indigo-700">
                          ${service.servicePrice}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors duration-300">
                        {service.serviceName}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">
                        {service.serviceDescription}
                      </p>

                      {/* Tags */}
                      {service.serviceTags && service.serviceTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.serviceTags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {service.serviceTags.length > 3 && (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                              +{service.serviceTags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-slate-400 text-sm flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ~{service.estimatedTime} days
                        </span>
                        <button
                          onClick={() => setIsQuoteOpen(true)}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                        >
                          Get Quote
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              How We Work
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              Our Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <div
                key={index}
                className="relative text-center md:text-left"
              >
                {/* Step Number */}
                <div className="flex md:flex-col items-center md:items-start gap-4 mb-4">
                  <span className="text-5xl font-bold text-indigo-100">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-slate-600 leading-relaxed md:pl-0 pl-14">
                  {item.description}
                </p>

                {/* Connector Line (hidden on mobile, shown on desktop except last) */}
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-linear-to-r from-indigo-300 to-transparent -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 bg-linear-to-br from-indigo-900 via-indigo-800 to-violet-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create a solution that drives real
            results for your business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Get Quote Button */}
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-800 font-semibold rounded-xl hover:bg-indigo-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Get a Free Quote
            </button>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <img src={whatsappicon} alt="WhatsApp" className="w-6 h-6" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurServicesPage;
